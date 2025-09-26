"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavigationProps {
  currentPath: string;
  navigateTo: (path: string) => void;
}

export function BreadcrumbNavigation({ currentPath, navigateTo }: BreadcrumbNavigationProps) {
  const breadcrumbItems = currentPath.split("/").filter(Boolean);
  const breadcrumbPaths = ["/"];
  for (let i = 0; i < breadcrumbItems.length; i++) {
    breadcrumbPaths.push(breadcrumbPaths[i] + (breadcrumbPaths[i] === "/" ? "" : "/") + breadcrumbItems[i]);
  }

  function getBreadcrumbLabel(index: number) {
    if (index === 0) {
      return "Root";
    }
    return breadcrumbItems[index - 1] ?? "";
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbPaths.map((path, index) => (
          <React.Fragment key={path}>
            <BreadcrumbItem>
              {index === breadcrumbPaths.length - 1 ? (
                <BreadcrumbPage>{getBreadcrumbLabel(index)}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink onClick={() => navigateTo(path)}>{getBreadcrumbLabel(index)}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbPaths.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
