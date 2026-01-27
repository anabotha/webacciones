/**
 * @deprecated - Use ../../tabs/index.tsx instead
 * 
 * This file has been replaced with a compound component implementation
 * that follows React composition patterns:
 * - Uses context for state management
 * - Provides explicit sub-components (Provider, Frame, List, Trigger, Content)
 * - Decouples state management from UI rendering
 * - Enables dependency injection of context
 * 
 * Migration guide:
 * Old: import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
 * New: import { Tabs } from "../../tabs"
 * 
 * Old usage:
 *   <Tabs value={activeTab} onValueChange={setActiveTab}>
 *     <TabsList>...</TabsList>
 *     <TabsContent value="tab1">...</TabsContent>
 *   </Tabs>
 * 
 * New usage:
 *   <Tabs.Provider initialTab="tab1">
 *     <Tabs.Frame>
 *       <Tabs.List>...</Tabs.List>
 *       <Tabs.Content value="tab1">...</Tabs.Content>
 *     </Tabs.Frame>
 *   </Tabs.Provider>
 */
