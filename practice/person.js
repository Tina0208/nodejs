class Person {
    constructor(name='noname',age='0'){
        this.a = name;
        this.b = age;
    }

    toJSON(){
        return {
            name: this.a,
            age: this.b,
        }
    }

    sayHello(){
        return `Hello ${this.a}`;
    }
}

const p1 = new Person('Bill',23);

console.log(p1.sayHello());
console.log(JSON.stringify(p1.toJSON()));
console.log(JSON.stringify(p1));

const f3 = a => a*a*a;

// module.exports = Person;
module.exports = {Person, f3}; 

//只能執行一次匯出，故可包成object或array來執行多項匯出。
//匯出一定要寫在最後一行。