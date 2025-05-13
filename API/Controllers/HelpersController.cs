using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [EnableCors("AllowOrigin")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class HelpersController : ControllerBase
    {
        [HttpGet("get-ip")]
        public IActionResult GetIPAddress()
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            return Ok(new { IP = ipAddress });
        }

    }
}
