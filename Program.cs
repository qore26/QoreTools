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

// Map controllers for API
app.MapControllers();

// Fallback to index.html for SPA routing
app.MapFallback(async (HttpContext httpContext) =>
{
    var indexPath = Path.Combine(app.Environment.WebRootPath, "index.html");
    
    if (File.Exists(indexPath))
    {
        httpContext.Response.ContentType = "text/html";
        await httpContext.Response.SendFileAsync(indexPath);
    }
});

app.Run();
