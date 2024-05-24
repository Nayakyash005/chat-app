#include <bits/stdc++.h>
using namespace std;

int main()
{
    // your code goes here
    int t;
    cin >> t;
    for (int i = 0; i < t; i++)
    {
        int n;
        cin >> n;
        string s;
        cin >> s;
        int cnt = 0;
        for (int j = 0; j < n - 1; j++)
        {
            if (s[j] != s[j + 1])
            {
                cnt++;
            }
        }
        if (cnt != 0 && cnt != 1)
        {
            cnt = cnt / 2;
        }
        cout << cnt << endl;
    }
}