using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Description
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(250)]
        public required string Name { get; set; }

        [MaxLength(50)]
        public string? AddedBy { get; set; }

        public DateTime? DateAdded { get; set; }

        //Nav props - start
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public ICollection<DescriptionLog> DescriptionLogs { get; set; } = [];
        //Nav props - end

        public bool? IsDeleted { get; set; }

    }
}
