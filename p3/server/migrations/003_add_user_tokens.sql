USE `engineering_plan_2`;

CREATE TABLE IF NOT EXISTS `user_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` VARCHAR(64) NOT NULL,
  `token_hash` CHAR(64) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `used_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_tokens_token_hash_unique` (`token_hash`),
  KEY `user_tokens_user_id_type_index` (`user_id`, `type`),
  KEY `user_tokens_expires_at_index` (`expires_at`),
  CONSTRAINT `user_tokens_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
