#include <bits/stdc++.h>
using namespace std;
int sum(int a,int b){
    return a+b;
}
int main(){
    freopen("input.txt", "r", stdin);                   
	freopen("coutput.txt", "w", stdout);

    int t;
cin>>t;
while(t--){
	 int a,b;
    cin>>a>>b;
    cout<<sum(a,b)<<"\n";
}
   
    return 0;
}