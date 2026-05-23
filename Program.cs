using QoreTools.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddScoped<IFileConversionService, FileConversionService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Serve static files from wwwroot
app.UseStaticFiles();
app.UseCors("AllowAll");

// Route static index.html for root
app.MapGet("/", async (HttpContext httpContext) =>
{
    var wwwroot = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "wwwroot");
    var indexPath = Path.Combine(wwwroot, "index.html");
    
    if (!File.Exists(indexPath))
    {
        indexPath = Path.Combine(AppContext.BaseDirectory, "wwwroot", "index.html");
    }
    
    if (File.Exists(indexPath))
    {
        httpContext.Response.ContentType = "text/html";
        await httpContext.Response.SendFileAsync(indexPath);
    }
    else
    {
        httpContext.Response.StatusCode = StatusCodes.Status404NotFound;
        await httpContext.Response.WriteAsync("Index file not found");
    }
});

// Map controllers for API
app.MapControllers();

// Fallback to index.html for SPA routing
app.MapFallback(async (HttpContext httpContext) =>
{
    var wwwroot = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "wwwroot");
    var indexPath = Path.Combine(wwwroot, "index.html");
    
    if (!File.Exists(indexPath))
    {
        indexPath = Path.Combine(AppContext.BaseDirectory, "wwwroot", "index.html");
    }
    
    if (File.Exists(indexPath))
    {
        httpContext.Response.ContentType = "text/html";
        await httpContext.Response.SendFileAsync(indexPath);
    }
});

app.Run();
