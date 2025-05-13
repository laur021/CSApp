using System;
using System.ComponentModel.DataAnnotations;
using Application.Enums;

namespace Application.DTOs;

public class AccountDto
{
    public int? Id { get; set; }
    
    [Required(ErrorMessage = "Full Name is required.")]
    [StringLength(50, ErrorMessage = "Full Name cannot exceed 50 characters.")]
    public  string FullName { get; set; } = null!;

    [Required(ErrorMessage = "Username is required.")]
    [StringLength(20, MinimumLength = 4, ErrorMessage = "Username must be between 4 and 20 characters.")]
    public  string Username { get; set; } = null!;
    
    [Required(ErrorMessage = "Password is required.")]
    [StringLength(20, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
    [DataType(DataType.Password)]
    public  string Password { get; set; } = null!;
    
    [Required(ErrorMessage = "Role is required.")]
    [EnumDataType(typeof(Role), ErrorMessage = "Invalid Role selected.")]
    public string Role { get; set; } = null!;

    [Required(ErrorMessage = "Team is required.")]
    [EnumDataType(typeof(Team), ErrorMessage = "Invalid Team selected.")]
    public string Team { get; set; } = null!;

    [Required(ErrorMessage = "Status is required.")]
    [EnumDataType(typeof(Status), ErrorMessage = "Invalid Status selected.")]
    public  string Status { get; set; } = null!;
    
    [StringLength(20, ErrorMessage = "AddedBy cannot exceed 20 characters.")]
    public string? AddedBy { get; set; }
    public DateTime? DateAdded { get; set; }
}

public class AccountLoginDto
{
    [Required(ErrorMessage = "Username is required.")]
    public required string Username { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    public required string Password { get; set; }
}

public class AccountResetPassDto
{
    [Required(ErrorMessage = "Password is required.")]
    [StringLength(20, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
    [DataType(DataType.Password)]
    public required string NewPassword { get; set; }
}