# TypeScript Challenge: Employee and Team Management API

This project is the final assignment for the TypeScript track, involving the creation of an API for managing employees and teams. The system supports various user roles with specific permissions:

- **Administrator**: Full system access, not part of any team.
- **Leader**: Leads a single team, with permissions to manage team details and members.
- **Employee**: Part of a team, with permissions to view and edit own data and team details.
- **Authenticated User**: Not part of any team or has any special permissions.

## Business Rules

1. Data validation is enforced by the backend.
2. Administrators can view and modify any data, except when restricted by other rules.
3. Administrators are pre-registered and cannot be removed, but can promote other users to administrators.
4. Teams cannot be deleted if they have members, but users can be removed from teams, except for leaders.
5. Each team must have a leader who can manage team data and member composition but not member data.
6. Employees can view and edit their data and view team data, but cannot change or leave their team.
7. Authenticated users exist without team assignments.

The project ensures strict adherence to these rules, providing a robust and secure API for efficient team and employee management.
