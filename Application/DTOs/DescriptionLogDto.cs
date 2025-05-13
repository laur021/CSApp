using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class DescriptionLogDto
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Action { get; set; } = null!;

    [Required(ErrorMessage = "Details name is required.")]
    [StringLength(250, ErrorMessage = "Details cannot exceed 250 characters.")]
    public string Detail { get; set; } = null!;

    public string? AddedBy { get; set; }

    public DateTime? DateAdded { get; set; }

    [Required]
    public int DescriptionId { get; set; }
}
