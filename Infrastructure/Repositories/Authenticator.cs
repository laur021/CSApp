using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.DTOs;
using Application.Iinterfaces;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Repositories;

public class Authenticator : IAuthenticator
{
    private readonly IConfiguration _configuration;
    private IUnitOfWork _unitOfWork;

    public Authenticator(IConfiguration configuration, IUnitOfWork unitOfWork)
    {
        _configuration = configuration;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthenticateDto> Authenticate(AccountLoginDto accountLoginDto)
    {
        if (string.IsNullOrWhiteSpace(accountLoginDto.Username) || string.IsNullOrWhiteSpace(accountLoginDto.Password))
            throw new Exception("User account not found");

        var userAccount = await _unitOfWork.AccountRepo
            .GetAsync(x => x.Username == accountLoginDto.Username &&
                x.Password == accountLoginDto.Password);

        if (userAccount is null)
            throw new Exception("User account not found");

        if (userAccount.IsDeleted == true)
            throw new Exception("User account not found");

        if (!userAccount.Status.Equals("Active", StringComparison.OrdinalIgnoreCase))
            throw new Exception("User account not found");

        var issuer = _configuration["JwtConfig:Issuer"];
        var audience = _configuration["JwtConfig:Audience"];
        var key = _configuration["JwtConfig:Key"] ?? "";
        var tokenValidityMins = _configuration.GetValue<int>("JwtConfig:TokenValidityMins");
        var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenValidityMins);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                 new Claim(JwtRegisteredClaimNames.Name,accountLoginDto.Username),
                 new Claim("Team", userAccount.Team)
            }),
            Expires = tokenExpiryTimeStamp,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                SecurityAlgorithms.HmacSha256Signature),
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        var accessToken = tokenHandler.WriteToken(securityToken);

        return new AuthenticateDto
        {
            Id = userAccount.Id,
            AccessToken = accessToken,
            Username = accountLoginDto.Username,
            ExpiresIn = (int)tokenExpiryTimeStamp.Subtract(DateTime.UtcNow).TotalSeconds,
            Role = userAccount.Role,
            Status = userAccount.Status,
            FullName = userAccount.FullName,
            Team = userAccount.Team
        };
    }

}
