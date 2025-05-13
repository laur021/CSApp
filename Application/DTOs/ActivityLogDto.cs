using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class ActivityLogDto
{   
    public int? Id { get; set; }
    
    [Required]
    public string Action { get; set; } = null!;
    
    [Required]
    public string Detail { get; set; }  = null!;
    
    public string? IpAddress { get; set; }
    
    public string AddedBy { get; set; }  = null!;

    public DateTime? DateAdded { get; set; }
}
