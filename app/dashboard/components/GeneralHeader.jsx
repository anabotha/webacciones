import React from "react";
import { LogoutButton } from "./ui/logout-button";

export const GeneralHeader = () => {
     return (
          <>
               <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="bg-primary/10 p-2 rounded-lg">
                         </div>
                         <div>
                              <h1 className="text-xl font-bold">Asistente de inversiones</h1>
                              <p className="text-sm text-muted-foreground">bot de wpp</p>
                         </div>
                    </div>
                    {/* <div className="flex items-center gap-2">
                         <LogoutButton />
                    </div> */}
               </div>
          </>
     );
};
