using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class ProductLogDto
{
    public int? Id { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Action { get; set; } = null!;

    [Required(ErrorMessage = "Details name is required.")]
    [StringLength(50, ErrorMessage = "Details cannot exceed 50 characters.")]
    public string Detail { get; set; } = null!;

    public string? AddedBy { get; set; }

    public DateTime? DateAdded { get; set; }

    [Required]
    public int ProductId { get; set; }
}
