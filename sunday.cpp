#include "sunday.h"

std::vector<int> sunday(const std::string& text, const std::string& pattern) {
    std::vector<int> matches;
    int n = text.length();
    int m = pattern.length();

    int jump[256];
    for (int i = 0; i < 256; ++i) {
        jump[i] = m + 1;
    }

    for (int i = 0; i < m; ++i) {
        jump[pattern[i]] = m - i;
    }

    int i = 0;
    while (i <= n - m) {
        int j;
        for (j = 0; j < m; ++j) {
            if (text[i + j] != pattern[j])
                break;
        }

        if (j == m)
            matches.push_back(i);

        if (i + m >= n)
            break;

        i += jump[text[i + m]];
    }

    return matches;
}
