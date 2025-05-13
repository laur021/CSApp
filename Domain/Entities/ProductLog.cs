using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class ProductLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public required string Action { get; set; }

        [Required]
        [StringLength(50)]
        public required string Detail { get; set; }

        public string? AddedBy { get; set; }

        public DateTime? DateAdded { get; set; }

        //Nav props
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}
