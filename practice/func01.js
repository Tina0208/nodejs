const f1 = a => a*a;
console.log(f1(7));

const f2 = ()=>{
    let sum = 0;
    for(let i=1; i<=10; i++) {
    sum += i;
    }
    return sum;
    }