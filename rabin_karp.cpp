#include "rabin_karp.h"
#include <vector>

std::vector<int> rabinKarp(const std::string& text, const std::string& pattern) {
    std::vector<int> matches;
    int n = text.length();
    int m = pattern.length();

    const int prime = 101; // A prime number

    int patternHash = 0;
    int textHash = 0;
    int power = 1;

    for (int i = 0; i <= n - m; ++i) {
        if (i == 0) {
            for (int j = 0; j < m; ++j) {
                patternHash = (patternHash + pattern[m - j - 1] * power) % prime;
                textHash = (textHash + text[m - j - 1] * power) % prime;

                if (j < m - 1)
                    power = (power * 2) % prime;
            }
        } else {
            textHash = (2 * (textHash - text[i - 1] * power) + text[i + m - 1]) % prime;
            if (textHash < 0)
                textHash += prime;
        }

        if (patternHash == textHash) {
            int j;
            for (j = 0; j < m; ++j) {
                if (text[i + j] != pattern[j])
                    break;
            }

            if (j == m)
                matches.push_back(i);
        }
    }

    return matches;
}

