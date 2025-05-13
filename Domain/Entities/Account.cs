using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Account
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string FullName { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Username { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Password { get; set; } = null!;

        [Required]
        [StringLength(10)]
        public string Role { get; set; } = null!;

        [Required]
        [StringLength(10)]
        public string Team { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = null!;

        [StringLength(20)]
        public string? AddedBy { get; set; }

        public DateTime? DateAdded { get; set; }

        public bool? IsDeleted { get; set; }

    }
}
