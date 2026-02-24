# Desk Booking System

## Overview

The Desk Booking System is a full-stack application designed to maximize office space utilization in a hybrid working environment. The organization has **50 seats**, where **10 seats are reserved as flooder (non-designated) seats** and **40 seats are designated for specific teams**.

The system allows employees to book seats based on their batch schedule, availability, and company policies.

---

## Problem Statement

In hybrid work environments, not all employees come to the office every day. This creates challenges in efficiently allocating limited workspace. The goal of this system is to ensure optimal seat utilization while enforcing company rules regarding batch schedules, designated seats, and booking restrictions.

---

## Seating Allocation

* Total seats available: **50**
* Flooder seats (non-designated): **10**
* Designated seats: **40**

Flooder seats can be used by employees who do not have a designated seat or need a temporary workspace.

---

## Batch Schedule

### Batch 1

* Week 1: Monday – Wednesday
* Week 2: Thursday – Friday

### Batch 2

* Week 1: Thursday – Friday
* Week 2: Monday – Wednesday

Employees can book seats according to their assigned batch schedule.

---

## Key Features

### Seat Booking

Employees can book available seats based on their batch schedule and seat availability.

### Week-wise Seat Allocation

The system provides a view to check seat allocation **week-wise** so employees can see which seats are occupied or available.

### Designated Seat Management

Employees with designated seats are assigned specific seats for their office days.

### Flooder Seat Booking

Employees without designated seats can book one of the **10 flooder seats** if available.

### Automatic Seat Release

If an employee marks themselves **on leave**, their seat is automatically released so others can book it.

### Non-Designated Day Booking Rule

If an employee wants to come to the office on a **non-designated day**, they can only book a seat **after 3 PM on the previous day**.

### Holiday Restriction

Seat booking is **not allowed on holidays**.

---

## Application Flow

1. User logs into the system.
2. The system checks the user's batch schedule.
3. The user views the **weekly seat allocation dashboard**.
4. The user selects a day and books an available seat.
5. If the user is on leave, the seat is automatically released.
6. If the user wants to book a seat for a non-designated day, the booking is allowed only **after 3 PM on the previous day**.
7. The system prevents bookings on holidays.

---

## Technology Stack

Frontend:

* React
* Tailwind CSS
* Shadcn UI

Backend:

* Node.js
* Express.js

Database:

* PostgreSQL

Authentication:

* JWT

---

## Goal

The main goal of this system is to **optimize office seat utilization**, provide transparency in seat allocation, and ensure fair usage of workspace resources.
