#include <iostream>
#include <fstream>
#include <vector>
#include <chrono>
#include "brute_force.h"
#include "sunday.h"
#include "kmp.h"
#include "rabin_karp.h"
#include "gusfield_z.h"
using namespace std;

std::string generateRandomText(int length) {
    std::string text;
    for (int i = 0; i < length; ++i) {
        text.push_back(rand() % 26 + 'a');
    }
    return text;
}

std::string generateRandomPattern(int length)
{
    std::string pattern;
    for (int i = 0; i < length; ++i)
    {
        pattern.push_back(rand() % 26 + 'a');
    }
    return pattern;
}

void measureAlgorithm(const std::string &algorithmName, std::vector<int> (*algorithm)(const std::string &, const std::string &), const std::string &text, const std::string &pattern, std::ofstream &outFile)
{
    auto start = std::chrono::steady_clock::now();
    std::vector<int> matches = algorithm(text, pattern);
    auto end = std::chrono::steady_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count();
    outFile << algorithmName << "," << text.length() << "," << duration << "\n";
}

int main() {
    srand(time(NULL));

    std::ofstream outFile("timing_data.txt");
    outFile << "Algorithm,TextLength,RunningTime(ns)\n";

    int numIterations = 10;
    int textLengthIncrement = 10000;
    int maxTextLength = 100000;

    for (int i = 0; i < numIterations; ++i) {
        int textLength = (i + 1) * textLengthIncrement;
        std::string text = generateRandomText(textLength);
        std::string pattern = generateRandomPattern(100);

        measureAlgorithm("Brute-Force", bruteForce, text, pattern, outFile);
        measureAlgorithm("Sunday", sunday, text, pattern, outFile);
        measureAlgorithm("KMP", KMP, text, pattern, outFile);
        measureAlgorithm("Rabin-Karp", rabinKarp, text, pattern, outFile);
        measureAlgorithm("Gusfield Z", gusfieldZ, text, pattern, outFile);
    }

    outFile.close();

    return 0;
}
