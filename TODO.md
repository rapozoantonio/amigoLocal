### TODO

- ADD LOGIN AND AUTH TO MANAGEMENT
- FIX APP BAR HEADER FOR PROFILE BUTTONS AND NAVIGATION FOR ALL BUNDLES
- CREATE A CRON JOB TO ADD EVENTS PERIODICALLY FORM BRAZIL AND PERHAPS OUT OF BRAZIL


### CONTEXT
Core Architecture

You've implemented a sophisticated Vue 3 application with a multi-bundle approach:
- Single Codebase, Multiple Entry Points: Using Vite's build system to create separate JavaScript bundles
- Shared Components & Logic: Common code shared across bundles while maintaining separation
- Subdomain-Based Routing: Different entry points accessed via different subdomains

Bundle Structure

- Your application is divided into three main bundles:

- Promotion Bundle (/promotion)
Public-facing event discovery and social features
Focused on content and user engagement
Optimized for mobile and lightweight use

- Management Bundle (/management)
Admin/producer interface for event management
Data-heavy dashboards and analytics
Accessed via admin.localhost subdomain

- Tickets Bundle (/tickets) - Not yet implemented
Will handle ticket sales and management

- Entry Point Initialization:
Fixed subdomain detection for proper bundle loading
Added custom Vite plugin to handle subdomain routing

- Router Configuration:

Created specialized router for management bundle
Added route aliases to handle different naming conventions
Set up placeholder auth routes to prevent navigation errors

- Component Context Awareness:
Added detection of which bundle a component is running in
Modified components to behave differently based on context
Prevented redirection loops between promotion and management

- HTML Entry Points:
Created proper HTML entry files for each bundle
Added smart redirect logic to route to correct entry point

- Authentication Status

The current authentication implementation:
Is shared between bundles (same login for promotion, management, tickets)
Routes exist but functionality is minimal in management bundle
Uses Firebase authentication behind the scenes
Needs a unified approach across bundles

Next Steps

- For the authentication system, you should now create a fresh conversation to discuss:

- Creating a unified auth store accessible to all bundles

- Implementing consistent login/register flows

- Setting up proper role-based access control

- Managing authentication state persistence

- Handling routing based on authentication status

- This approach will let you leverage the multi-bundle architecture while maintaining a seamless user experience across the application.