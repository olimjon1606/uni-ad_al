#include "gusfield_z.h"
#include <vector>
#include <algorithm>

std::vector<int> zFunction(const std::string& str) {
    int n = str.length();
    std::vector<int> Z(n, 0);
    int left = 0;
    int right = 0;

    for (int i = 1; i < n; ++i) {
        if (i > right) {
            left = right = i;
            while (right < n && str[right - left] == str[right])
                right++;
            Z[i] = right - left;
            right--;
        } else {
            int k = i - left;
            if (Z[k] < right - i + 1) {
                Z[i] = Z[k];
            } else {
                left = i;
                while (right < n && str[right - left] == str[right])
                    right++;
                Z[i] = right - left;
                right--;
            }
        }
    }
    return Z;
}

std::vector<int> gusfieldZ(const std::string& text, const std::string& pattern) {
    std::vector<int> matches;
    std::string str = pattern + "$" + text;
    std::vector<int> Z = zFunction(str);
    int patternLength = pattern.length();
    int n = text.length();

    for (int i = patternLength + 1; i <= n + patternLength; ++i) {
        if (Z[i] == patternLength)
            matches.push_back(i - patternLength - 1);
    }

    return matches;
}
