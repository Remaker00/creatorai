'use client';
import { useMemo, useState } from "react";

function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export default function DebounceSearch() {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (value: string): void => {
    console.log("API Call:", value);
  };

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 500),
    []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;

    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input
        value={search}
        onChange={handleChange}
        placeholder="Search..."
      />
    </div>
  );
}