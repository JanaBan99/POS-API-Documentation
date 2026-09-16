---
description: "The date and time format accepted and returned by the SalesPlay API (YYYY-MM-DD HH:MM:SS, 24-hour clock), and how date-range filters work."
---

# Dates & Times

> All dates and times in the SalesPlay API use the 24-hour format.

---

## Overview

The SalesPlay API standardizes all date and time values using the 24-hour clock format. This applies to both requests sent to the API and responses received from it.

---

## In Requests

When making API requests, all date and time values must be specified in 24-hour format.

**Example:**

| Intent         | Correct (24-hour) | Incorrect (12-hour) |
|----------------|-------------------|----------------------|
| 2:30 PM        | `14:30`           | `2:30 PM`            |
| Midnight       | `00:00`           | `12:00 AM`           |
| 9:00 AM        | `09:00`           | `9:00 AM`            |

---

## In Responses

When processing API responses, dates and times are returned in 24-hour format. You should convert these values to your local time zone as needed before displaying them to end users.

> **Note:** The API does not perform time zone conversion. Your application is responsible for interpreting and converting timestamps to local time.

---

## Summary

| Context          | Requirement                                      |
|------------------|--------------------------------------------------|
| API Requests     | Specify dates and times in 24-hour format        |
| API Responses    | Convert received timestamps to your local time   |