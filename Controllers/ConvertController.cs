using Microsoft.AspNetCore.Mvc;
using QoreTools.Services;
using System.ComponentModel.DataAnnotations;

namespace QoreTools.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConvertController : ControllerBase
    {
        private readonly IFileConversionService _conversionService;
        private readonly ILogger<ConvertController> _logger;
        private const long MaxFileSize = 50 * 1024 * 1024; // 50 MB

        public ConvertController(IFileConversionService conversionService, ILogger<ConvertController> logger)
        {
            _conversionService = conversionService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Convert(
            [FromForm] IFormFile file,
            [FromForm] string sourceFormat,
            [FromForm] string targetFormat,
            [FromForm] int quality = 90)
        {
            try
            {
                // Validation
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file provided");
                }

                if (file.Length > MaxFileSize)
                {
                    return StatusCode(StatusCodes.Status413PayloadTooLarge, "File size exceeds maximum limit of 50 MB");
                }

                if (string.IsNullOrWhiteSpace(sourceFormat) || string.IsNullOrWhiteSpace(targetFormat))
                {
                    return BadRequest("Source and target formats are required");
                }

                if (quality < 1 || quality > 100)
                {
                    return BadRequest("Quality must be between 1 and 100");
                }

                // Check if conversion is supported
                if (!_conversionService.CanConvert(sourceFormat, targetFormat))
                {
                    return BadRequest($"Conversion from {sourceFormat} to {targetFormat} is not supported");
                }

                // Perform conversion
                using var stream = file.OpenReadStream();
                var convertedData = await _conversionService.ConvertFileAsync(stream, sourceFormat, targetFormat, quality);
                
                // Ensure content-type is set properly for mobile browsers
                var contentType = GetContentType(targetFormat);
                var response = File(convertedData, contentType, $"converted.{targetFormat}");
                
                // Add headers for mobile compatibility
                Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
                Response.Headers["Pragma"] = "no-cache";
                Response.Headers["Expires"] = "0";
                Response.Headers["Access-Control-Allow-Origin"] = "*";
                
                return response;
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Conversion error: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error during conversion: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred during file conversion");
            }
        }

        [HttpGet("formats")]
        public IActionResult GetSupportedFormats()
        {
            var formats = new
            {
                documents = new[] { "pdf", "docx", "doc", "txt", "xlsx", "pptx" },
                images = new[] { "jpg", "jpeg", "png", "gif", "bmp", "webp", "svg" },
                archives = new[] { "zip", "rar", "7z" }
            };

            return Ok(formats);
        }

        private string GetContentType(string format)
        {
            return format.ToLower() switch
            {
                "pdf" => "application/pdf",
                "jpg" or "jpeg" => "image/jpeg",
                "png" => "image/png",
                "gif" => "image/gif",
                "webp" => "image/webp",
                "svg" => "image/svg+xml",
                "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "doc" => "application/msword",
                "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "txt" => "text/plain",
                "csv" => "text/csv",
                "html" => "text/html",
                "zip" => "application/zip",
                "rar" => "application/x-rar-compressed",
                "7z" => "application/x-7z-compressed",
                _ => "application/octet-stream"
            };
        }
    }
}
