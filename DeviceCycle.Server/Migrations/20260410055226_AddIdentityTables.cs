using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeviceCycle.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddIdentityTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create Identity tables only — existing app tables (devices, change_logs, FirmwareVersions)
            // were created outside of migrations and are left untouched.

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetRoles' AND xtype='U')
                CREATE TABLE [AspNetRoles] (
                    [Id] nvarchar(450) NOT NULL,
                    [Name] nvarchar(256) NULL,
                    [NormalizedName] nvarchar(256) NULL,
                    [ConcurrencyStamp] nvarchar(max) NULL,
                    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
                );
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUsers' AND xtype='U')
                CREATE TABLE [AspNetUsers] (
                    [Id] nvarchar(450) NOT NULL,
                    [FullName] nvarchar(max) NULL,
                    [UserName] nvarchar(256) NULL,
                    [NormalizedUserName] nvarchar(256) NULL,
                    [Email] nvarchar(256) NULL,
                    [NormalizedEmail] nvarchar(256) NULL,
                    [EmailConfirmed] bit NOT NULL DEFAULT 0,
                    [PasswordHash] nvarchar(max) NULL,
                    [SecurityStamp] nvarchar(max) NULL,
                    [ConcurrencyStamp] nvarchar(max) NULL,
                    [PhoneNumber] nvarchar(max) NULL,
                    [PhoneNumberConfirmed] bit NOT NULL DEFAULT 0,
                    [TwoFactorEnabled] bit NOT NULL DEFAULT 0,
                    [LockoutEnd] datetimeoffset NULL,
                    [LockoutEnabled] bit NOT NULL DEFAULT 0,
                    [AccessFailedCount] int NOT NULL DEFAULT 0,
                    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
                );
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetRoleClaims' AND xtype='U')
                CREATE TABLE [AspNetRoleClaims] (
                    [Id] int NOT NULL IDENTITY,
                    [RoleId] nvarchar(450) NOT NULL,
                    [ClaimType] nvarchar(max) NULL,
                    [ClaimValue] nvarchar(max) NULL,
                    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
                    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId])
                        REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
                );
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUserClaims' AND xtype='U')
                CREATE TABLE [AspNetUserClaims] (
                    [Id] int NOT NULL IDENTITY,
                    [UserId] nvarchar(450) NOT NULL,
                    [ClaimType] nvarchar(max) NULL,
                    [ClaimValue] nvarchar(max) NULL,
                    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
                    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId])
                        REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
                );
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUserLogins' AND xtype='U')
                CREATE TABLE [AspNetUserLogins] (
                    [LoginProvider] nvarchar(450) NOT NULL,
                    [ProviderKey] nvarchar(450) NOT NULL,
                    [ProviderDisplayName] nvarchar(max) NULL,
                    [UserId] nvarchar(450) NOT NULL,
                    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
                    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId])
                        REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
                );
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUserRoles' AND xtype='U')
                CREATE TABLE [AspNetUserRoles] (
                    [UserId] nvarchar(450) NOT NULL,
                    [RoleId] nvarchar(450) NOT NULL,
                    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
                    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId])
                        REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
                    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId])
                        REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
                );
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUserTokens' AND xtype='U')
                CREATE TABLE [AspNetUserTokens] (
                    [UserId] nvarchar(450) NOT NULL,
                    [LoginProvider] nvarchar(450) NOT NULL,
                    [Name] nvarchar(450) NOT NULL,
                    [Value] nvarchar(max) NULL,
                    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
                    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId])
                        REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
                );
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='RoleNameIndex' AND object_id = OBJECT_ID('AspNetRoles'))
                CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='EmailIndex' AND object_id = OBJECT_ID('AspNetUsers'))
                CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='UserNameIndex' AND object_id = OBJECT_ID('AspNetUsers'))
                CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_AspNetRoleClaims_RoleId' AND object_id = OBJECT_ID('AspNetRoleClaims'))
                CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_AspNetUserClaims_UserId' AND object_id = OBJECT_ID('AspNetUserClaims'))
                CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_AspNetUserLogins_UserId' AND object_id = OBJECT_ID('AspNetUserLogins'))
                CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_AspNetUserRoles_RoleId' AND object_id = OBJECT_ID('AspNetUserRoles'))
                CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("IF OBJECT_ID('AspNetUserTokens') IS NOT NULL DROP TABLE [AspNetUserTokens];");
            migrationBuilder.Sql("IF OBJECT_ID('AspNetUserRoles') IS NOT NULL DROP TABLE [AspNetUserRoles];");
            migrationBuilder.Sql("IF OBJECT_ID('AspNetUserLogins') IS NOT NULL DROP TABLE [AspNetUserLogins];");
            migrationBuilder.Sql("IF OBJECT_ID('AspNetUserClaims') IS NOT NULL DROP TABLE [AspNetUserClaims];");
            migrationBuilder.Sql("IF OBJECT_ID('AspNetRoleClaims') IS NOT NULL DROP TABLE [AspNetRoleClaims];");
            migrationBuilder.Sql("IF OBJECT_ID('AspNetUsers') IS NOT NULL DROP TABLE [AspNetUsers];");
            migrationBuilder.Sql("IF OBJECT_ID('AspNetRoles') IS NOT NULL DROP TABLE [AspNetRoles];");
        }
    }
}
