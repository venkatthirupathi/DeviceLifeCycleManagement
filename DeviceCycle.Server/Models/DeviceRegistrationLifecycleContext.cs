using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DeviceCycle.Server.Models;

public partial class DeviceRegistrationLifecycleContext : IdentityDbContext<ApplicationUser>
{
    public DeviceRegistrationLifecycleContext()
    {
    }

    public DeviceRegistrationLifecycleContext(DbContextOptions<DeviceRegistrationLifecycleContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChangeLog> ChangeLogs { get; set; }

    public virtual DbSet<Device> Devices { get; set; }

    public virtual DbSet<FirmwareVersion> FirmwareVersions { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ChangeLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__change_l__3213E83FFAD2543B");

            entity.ToTable("change_logs");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Action)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("action");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DeviceId).HasColumnName("device_id");

            entity.HasOne(d => d.Device).WithMany(p => p.ChangeLogs)
                .HasForeignKey(d => d.DeviceId)
                .HasConstraintName("fk_change_logs_devices");
        });

        modelBuilder.Entity<Device>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__devices__3213E83F88ADB518");

            entity.ToTable("devices");

            entity.HasIndex(e => e.SerialNumber, "UQ__devices__BED14FEEB2C13C5C").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.FirmwareVersion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("firmware_version");
            entity.Property(e => e.Model)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("model");
            entity.Property(e => e.SerialNumber)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("serial_number");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<FirmwareVersion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Firmware__3213E83F058A131F");

            entity.HasIndex(e => e.Version, "UQ__Firmware__79B5C94DFE2005EA").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Notes)
                .HasColumnType("text")
                .HasColumnName("notes");
            entity.Property(e => e.ReleasedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("released_at");
            entity.Property(e => e.Version)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("version");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
