#include <bits/stdc++.h>
using namespace std;
#include "funcDef.h"
int main(){
    freopen("input.txt", "r", stdin);                   
	freopen("output.txt", "w", stdout);
	
    int t;
    cin>>t;
    while(t--){
	int a,b;
    cin>>a>>b;
    cout<<sum(a,b)<<"\n";
    }

    
    return 0;
}