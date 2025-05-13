using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class ProductDto
{
        public int? Id { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Maximum character limit is 100.")]
        public string Name { get; set; } = null!;

        public string AddedBy { get; set; } = null!;

        public DateTime? DateAdded { get; set; }

}

public class ProductCompleteDetailsDto
{
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string AddedBy { get; set; } = null!;

        public DateTime? DateAdded { get; set; }

        public ICollection<DescriptionDto> Descriptions { get; set; } = [];

        public ICollection<ProductLogDto> ProductLogs { get; set; } = [];

}

public class ProductWithLogsDto
{
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string AddedBy { get; set; } = null!;

        public DateTime? DateAdded { get; set; }

        public ICollection<ProductLogDto> ProductLogs { get; set; } = [];

}

public class ProductWithDescriptionsDto
{
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string AddedBy { get; set; } = null!;

        public DateTime? DateAdded { get; set; }

       public ICollection<DescriptionDto> Descriptions { get; set; } = [];

}
