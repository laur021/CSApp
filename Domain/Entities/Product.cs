using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public required string Name { get; set; }

         [StringLength(20)]
        public string? AddedBy { get; set; }

        public DateTime? DateAdded { get; set; }

        public ICollection<Description> Descriptions { get; set; } = [];

        public ICollection<ProductLog> ProductLogs { get; set; } = [];

        public bool? IsDeleted { get; set; }
    }
}
