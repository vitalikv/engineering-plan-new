USE `engineering_plan_2`;

CREATE TABLE IF NOT EXISTS `rate_limits` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `action_name` VARCHAR(64) NOT NULL,
  `scope_key` CHAR(64) NOT NULL,
  `hits` INT UNSIGNED NOT NULL DEFAULT 0,
  `window_started_at` DATETIME NOT NULL,
  `blocked_until` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rate_limits_action_scope_unique` (`action_name`, `scope_key`),
  KEY `rate_limits_blocked_until_index` (`blocked_until`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
