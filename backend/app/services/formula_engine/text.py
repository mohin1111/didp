"""
Text formula functions - LEFT, RIGHT, MID, TRIM, UPPER, LOWER, etc.
"""
import re
from typing import List, Any

import pandas as pd


class TextFormulaMixin:
    """Mixin with text manipulation functions."""

    def left(self, text: str, num_chars: int) -> str:
        """LEFT function - returns leftmost characters from text."""
        if text is None:
            return ""
        return str(text)[:num_chars]

    def right(self, text: str, num_chars: int) -> str:
        """RIGHT function - returns rightmost characters from text."""
        if text is None:
            return ""
        return str(text)[-num_chars:] if num_chars > 0 else ""

    def mid(self, text: str, start_pos: int, num_chars: int) -> str:
        """MID function - returns characters from middle of text (1-based indexing)."""
        if text is None:
            return ""
        text = str(text)
        start_idx = max(0, start_pos - 1)
        return text[start_idx:start_idx + num_chars]

    def trim(self, text: str) -> str:
        """TRIM function - removes leading/trailing spaces and extra internal spaces."""
        if text is None:
            return ""
        return re.sub(r'\s+', ' ', str(text).strip())

    def len_text(self, text: str) -> int:
        """LEN function - returns length of text."""
        if text is None:
            return 0
        return len(str(text))

    def upper(self, text: str) -> str:
        """UPPER function - converts text to uppercase."""
        if text is None:
            return ""
        return str(text).upper()

    def lower(self, text: str) -> str:
        """LOWER function - converts text to lowercase."""
        if text is None:
            return ""
        return str(text).lower()

    def proper(self, text: str) -> str:
        """PROPER function - capitalizes first letter of each word."""
        if text is None:
            return ""
        return str(text).title()

    def concat(self, *texts) -> str:
        """CONCAT/CONCATENATE function - joins multiple texts."""
        return "".join(str(t) if t is not None else "" for t in texts)

    def text_join(self, delimiter: str, *texts) -> str:
        """TEXTJOIN function - joins texts with delimiter."""
        return delimiter.join(str(t) if t is not None else "" for t in texts)

    def find(self, find_text: str, within_text: str, start_pos: int = 1) -> int:
        """FIND function - finds position of text (case-sensitive). Returns -1 if not found."""
        if find_text is None or within_text is None:
            return -1
        try:
            idx = str(within_text).index(str(find_text), start_pos - 1)
            return idx + 1
        except ValueError:
            return -1

    def search(self, find_text: str, within_text: str, start_pos: int = 1) -> int:
        """SEARCH function - finds position of text (case-insensitive). Returns -1 if not found."""
        if find_text is None or within_text is None:
            return -1
        try:
            idx = str(within_text).lower().index(str(find_text).lower(), start_pos - 1)
            return idx + 1
        except ValueError:
            return -1

    def substitute(self, text: str, old_text: str, new_text: str, instance: int = None) -> str:
        """SUBSTITUTE function - replaces text."""
        if text is None:
            return ""
        text = str(text)
        if instance is None:
            return text.replace(str(old_text), str(new_text))
        else:
            parts = text.split(str(old_text))
            if instance <= 0 or instance > len(parts) - 1:
                return text
            result = str(old_text).join(parts[:instance]) + str(new_text) + str(old_text).join(parts[instance:])
            return result

    def replace(self, text: str, start_pos: int, num_chars: int, new_text: str) -> str:
        """REPLACE function - replaces characters at position."""
        if text is None:
            return str(new_text)
        text = str(text)
        start_idx = start_pos - 1
        return text[:start_idx] + str(new_text) + text[start_idx + num_chars:]

    def rept(self, text: str, times: int) -> str:
        """REPT function - repeats text."""
        if text is None:
            return ""
        return str(text) * max(0, times)

    def text_col(self, data: pd.DataFrame, column: str, func_name: str, *args) -> List[str]:
        """Apply text function to entire column."""
        results = []
        for val in data[column]:
            if func_name == 'left':
                results.append(self.left(val, args[0]))
            elif func_name == 'right':
                results.append(self.right(val, args[0]))
            elif func_name == 'mid':
                results.append(self.mid(val, args[0], args[1]))
            elif func_name == 'trim':
                results.append(self.trim(val))
            elif func_name == 'upper':
                results.append(self.upper(val))
            elif func_name == 'lower':
                results.append(self.lower(val))
            elif func_name == 'proper':
                results.append(self.proper(val))
            elif func_name == 'len':
                results.append(self.len_text(val))
            else:
                results.append(str(val) if val is not None else "")
        return results

    def apply_text(self, data: pd.DataFrame, column_name: str, source_col: str,
                   func_name: str, *args) -> pd.DataFrame:
        """Apply text function and create new column."""
        results = self.text_col(data, source_col, func_name, *args)
        data = data.copy()
        data[column_name] = results
        return data

    def split_text(self, text: str, delimiter: str, index: int = None) -> Any:
        """Split text by delimiter."""
        if text is None:
            return [] if index is None else ""
        parts = str(text).split(delimiter)
        if index is None:
            return parts
        if index < 1 or index > len(parts):
            return ""
        return parts[index - 1]
