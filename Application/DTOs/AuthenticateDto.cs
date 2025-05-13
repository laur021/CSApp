using System;

namespace Application.DTOs;

public class AuthenticateDto
{
        public int Id { get; set; }

        public string? Username { get; set; }   

        public string AccessToken { get; set; } = null!;

        public int ExpiresIn { get; set; }

        public string? Role { get; set; }

        public string? Team { get; set; }

        public string? Status {get; set; }

        public string? FullName { get; set; }
}
