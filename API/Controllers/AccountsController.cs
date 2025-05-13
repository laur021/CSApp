
using API.Helpers;

using Application.DTOs;
using Application.Iinterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Infrastructure.Repositories;
using Application.Interfaces;
using System.Linq.Expressions;
using Domain.Entities;

namespace API.Controllers
{
    [Authorize]
    [EnableCors("AllowOrigin")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AccountsController(IUnitOfWork _unitOfWork, IAuthenticator _authenticator) : ControllerBase
    {

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AuthenticateDto>> Login(AccountLoginDto loginDto)
        {
            var result = await _authenticator.Authenticate(loginDto);
            if (result is null)
                return Unauthorized();

            var options = new CookieOptions
            {
                IsEssential = true,
                HttpOnly = true,
                Secure = true, // Only for HTTPS
                SameSite = SameSiteMode.None, // Necessary for cross-origin
                Expires = DateTime.UtcNow.AddHours(1) // Set expiration timetest

            };
            Response.Cookies.Append("auth_token", result.AccessToken, options);

            return result;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentAccount()
        {
            var username = User.Identity?.Name;

            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            var userAccount = await _unitOfWork.AccountRepo.GetAsync(x => x.Username == username);

            if (userAccount == null)
                return NotFound();

            // Extract the `exp` claim from the authenticated user's claims
            var expClaim = User.Claims.FirstOrDefault(claim => claim.Type == "exp")?.Value;
            if (expClaim == null)
                return BadRequest("Invalid token: 'exp' claim is missing.");

            // Convert the `exp` claim to a DateTime
            var expTime = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expClaim)).DateTime;

            // Calculate the remaining time until expiration (in seconds)
            var expiresIn = (int)(expTime - DateTime.UtcNow).TotalSeconds;

            return Ok(new AuthenticateDto
            {
                Id = userAccount.Id,
                Username = userAccount.Username,
                AccessToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", ""),
                ExpiresIn = expiresIn,
                Role = userAccount.Role,
                Status = userAccount.Status,
                FullName = userAccount.FullName,
                Team = userAccount.Team,
            });
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<AccountDto>>> GetAllAccountsAsync([FromQuery] int skip = 0,
        [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {

            Expression<Func<AccountDto, bool>>? filter = null; 

            if (!string.IsNullOrEmpty(search))
    {
            filter = account =>
            account.FullName.Contains(search.Trim()) ||
            account.Username.Contains(search.Trim()) ||
            account.Role.Contains(search.Trim()) ||
            account.Status.Contains(search.Trim());
    }
              
            var obj = 
                search != null 
                ? await _unitOfWork.AccountRepo.GetAllAsync<AccountDto>(skip: skip, pageSize: pageSize, filter)
                : await _unitOfWork.AccountRepo.GetAllAsync<AccountDto>(skip: skip, pageSize: pageSize);

            return Ok(obj);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetAccountAsync(int Id)
        {
            var obj = await _unitOfWork.AccountRepo.GetAsync<AccountDto>(x => x.Id == Id);

            return obj is not null ?
                Ok(obj) :
                NotFound($"User with ID {Id} not found.");
        }

        [HttpPost("register")]
        public async Task<IActionResult> AddAccountAsync(AccountDto newUser)
        {
            if (newUser is null)
                return BadRequest("Invalid user account data.");

            var obj = await _unitOfWork.AccountRepo
                    .GetAsync(x => x.Username!.ToLower().Trim() == newUser.Username.ToLower().Trim() &&
                          (x.IsDeleted == false || x.IsDeleted == null));

            if (obj is not null)
                return Conflict("Username is already taken.");

            var addedUser = await _unitOfWork.AccountRepo.AddAsync(newUser);

            return Ok(addedUser);

        }

        [HttpPut("{Id}/details")]
        public async Task<IActionResult> UpdateAccountAsync(int Id, AccountDto accountDto)
        {

            var obj = await _unitOfWork.AccountRepo
                    .GetAsync(x => x.Username!.ToLower().Trim() == accountDto.Username.ToLower().Trim() &&
                          x.Id != Id &&
                          (x.IsDeleted == false || x.IsDeleted == null));

            if (obj is not null)
                return Conflict("Username is already taken.");


            await _unitOfWork.AccountRepo.UpdateAsync(Id, accountDto);

            var isUpdated = await _unitOfWork.SaveMasterAsync();

            return isUpdated ?
                Ok() :
                StatusCode(StatusCodes.Status500InternalServerError, "Error updating user account.");
        }

        [HttpPut("{Id}/resetPassword")]
        public async Task<IActionResult> ResetPasswordAsync(int Id, AccountResetPassDto accountResetPassDto)
        {
            var obj = await _unitOfWork.AccountRepo.GetAsync<AccountDto>(x => x.Id == Id);

            if (obj is null)
                return NotFound();

            obj.Password = accountResetPassDto.NewPassword;

            await _unitOfWork.AccountRepo.UpdateAsync(Id, obj);

            var isUpdated = await _unitOfWork.SaveMasterAsync();

            return isUpdated ?
                NoContent() :
                StatusCode(StatusCodes.Status500InternalServerError, "Error updating password.");

        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteUserAccountAsync(int Id)
        {
            var isDeleted = await _unitOfWork.AccountRepo.DeleteAsync(Id);
            return isDeleted
                ? NoContent()
                : NotFound($"User with ID {Id} not found.");
        }
    }
}
