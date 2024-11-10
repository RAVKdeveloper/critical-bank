-- Sql скрипты для создания нужных схем в clickhouse

CREATE DATABASE IF NOT EXISTS critical_bank;

USE critical_bank;

CREATE TABLE IF NOT EXISTS logs
(
    userId String,
    level String,
    message String,
    timestamp DateTime,
    service String,
    data String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, userId, level)
SETTINGS index_granularity = 8192;
