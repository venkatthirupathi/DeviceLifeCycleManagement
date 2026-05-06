using DeviceCycle.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace DeviceCycle.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class ChangeLogsController : ControllerBase
{
    private readonly DeviceRegistrationLifecycleContext _context;

    public ChangeLogsController(DeviceRegistrationLifecycleContext context)
    {
        _context = context;
    }

    // ──────────────────────────────────────────────────────────────
    // GET /api/changelogs/device/{deviceId}
    // ──────────────────────────────────────────────────────────────
    /// <summary>
    /// Get the full change history for a device, ordered newest first.
    /// Used for lifecycle auditing and UI timeline views.
    /// </summary>
    /// <param name="deviceId">Device ID</param>
    [HttpGet("device/{deviceId:int}")]
    [ProducesResponseType(typeof(DeviceHistoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DeviceHistoryDto>> GetDeviceHistory(int deviceId)
    {
        var device = await _context.Devices.FindAsync(deviceId);
        if (device is null)
            return NotFound(new { message = $"Device with id {deviceId} not found." });

        var logs = await _context.ChangeLogs
            .Where(c => c.DeviceId == deviceId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ChangeLogEntryDto(c.Id, c.Action, c.CreatedAt))
            .ToListAsync();

        return Ok(new DeviceHistoryDto(
            deviceId,
            device.SerialNumber,
            device.Model,
            device.Status,
            device.FirmwareVersion,
            device.CreatedAt,
            device.UpdatedAt,
            logs));
    }

    // ──────────────────────────────────────────────────────────────
    // GET /api/changelogs?deviceId=&action=&from=&to=
    // ──────────────────────────────────────────────────────────────
    /// <summary>
    /// Query change logs across all devices with optional filters.
    /// Supports filtering by device, action keyword, and date range.
    /// </summary>
    /// <param name="deviceId">Optional device ID filter</param>
    /// <param name="action">Optional action keyword filter (e.g. FIRMWARE, STATUS)</param>
    /// <param name="from">Optional start date (UTC, inclusive)</param>
    /// <param name="to">Optional end date (UTC, inclusive)</param>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ChangeLogEntryWithDeviceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ChangeLogEntryWithDeviceDto>>> GetChangeLogs(
        [FromQuery] int? deviceId,
        [FromQuery] string? action,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        IQueryable<ChangeLog> query = _context.ChangeLogs.Include(c => c.Device);

        if (deviceId.HasValue)
            query = query.Where(c => c.DeviceId == deviceId.Value);

        if (!string.IsNullOrWhiteSpace(action))
            query = query.Where(c => c.Action.Contains(action));

        if (from.HasValue)
            query = query.Where(c => c.CreatedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(c => c.CreatedAt <= to.Value);

        var logs = await query
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ChangeLogEntryWithDeviceDto(
                c.Id,
                c.DeviceId,
                c.SerialNumber ?? (c.Device != null ? c.Device.SerialNumber : "Unknown"),
                c.Action,
                c.CreatedAt))
            .ToListAsync();

        return Ok(logs);
    }
}

// ──────────────────────────────────────────────────────────────────
// DTOs
// ──────────────────────────────────────────────────────────────────

/// <summary>A single audit log entry.</summary>
public record ChangeLogEntryDto(int Id, string Action, DateTime CreatedAt);

/// <summary>A single audit log entry with device identifiers, for cross-device queries.</summary>
public record ChangeLogEntryWithDeviceDto(
    int Id,
    int? DeviceId,
    string SerialNumber,
    string Action,
    DateTime CreatedAt);

/// <summary>Full lifecycle history for a device.</summary>
public record DeviceHistoryDto(
    int DeviceId,
    string SerialNumber,
    string? Model,
    string Status,
    string? FirmwareVersion,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IEnumerable<ChangeLogEntryDto> History);