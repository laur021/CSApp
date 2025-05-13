using System;

namespace Application.DTOs;

public class DescriptionDto
{
    public int? Id { get; set; }

    public required string Name { get; set; }

    public string? AddedBy { get; set; }

    public DateTime? DateAdded { get; set; }

    public int ProductId { get; set; }
}

public class DescriptionWithLogsDto
{
    public int Id { get; set; }
    
    public required string Name { get; set; }

    public string? AddedBy { get; set; }

    public DateTime? DateAdded { get; set; }

    public int ProductId { get; set; }

    public ICollection<DescriptionLogDto> DescriptionLogs { get; set; } = [];
}
