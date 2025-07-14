import ClockIcon from "../assets/clock.svg?react";
import CheckIcon from "../assets/check-circle.svg?react";
import ExclamationIcon from "../assets/exclamation.svg?react";

class Utils {
  // Checks if a value is empty (null, undefined, empty string, or array/object with no keys)
  static isEmpty(value: any): boolean {
    if (value == null) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    )
      return true;
    return false;
  }

  static getLightColor = (color: string) => {
    const colorMap = {
      blue: "#EBF8FF",
      green: "#DCFCE7",
      red: "#FEE2E2",
      orange: "#FEF3C7",
    };

    return colorMap[color as keyof typeof colorMap] || color;
  };

  // Deep clones an object or array
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  // Capitalizes the first letter of a string
  static capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static getStatusLabel = (status?: string) => {
    switch (status) {
      case "toDo":
        return "To Do";
      case "inProgress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return "";
    }
  };

  static getStatusColor = (status?: string) => {
    switch (status) {
      case "done":
        return "#22c55e"; // green
      case "inProgress":
        return "#f59e42"; // orange
      case "toDo":
        return "#3b82f6"; // blue
      default:
        return "#6b7280"; // gray
    }
  };

  static getPriorityColor = (status?: string) => {
    switch (status) {
      case "low":
        return "#22c55e"; // green
      case "medium":
        return "#f59e42"; // orange
      case "high":
        return "red";
      default:
        return "#6b7280"; // gray
    }
  };

  // Returns a lighter background color for priority
  static getPriorityBgColor = (status?: string) => {
    switch (status) {
      case "low":
        return "#DCFCE7"; // light green
      case "medium":
        return "#FEF3C7"; // light orange
      case "high":
        return "#FEE2E2"; // light red
      default:
        return "#F3F4F6"; // light gray
    }
  };

  static getStatusBgColor = (status?: string) => {
    switch (status) {
      case "done":
        return "#DCFCE7"; // light green
      case "inProgress":
        return "#FEF3C7"; // light orange
      case "toDo":
        return "#EBF8FF"; // light blue
      default:
        return "#F3F4F6"; // light gray
    }
  };
  static getIcon = (status?: string) => {
    switch (status) {
      case "inProgress":
        return <ClockIcon width={12} height={12} />;
      case "Done":
        return <CheckIcon width={12} height={12} />;
      case "toDo":
        return <ExclamationIcon width={12} height={12} />;
      default:
        return null;
    }
  };

  // Formats a date string to a more readable format (e.g., "2024-06-01" -> "June 1, 2024")
  static formatDate(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // fallback if invalid

    // Example: July 20, 2025
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Capitalizes the first letter of a string and lowercases the rest
  static capitalized(str?: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

export default Utils;
