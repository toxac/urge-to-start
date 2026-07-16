We have three foundational pieces already written:

1. ICS utility (lib/calendar/ics.ts)
2. useKipProgress (just fixed)
3. useKipActions (import fix needed)

Now we can start building the UI components. I suggest we begin with the leaf components that don’t depend on others:
- KipRecommendationItem
- KipObservationZone
- KipReflectionZone
- KipPrerequisiteItem

Then we can compose them into:

- KipTaskModule
- KipBlueprintModule
- KipMissionView
- KipDashboardView

Finally, 
- KipQuestView and 
- KipSidebarCompanion.