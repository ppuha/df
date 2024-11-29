function Series(data) {
    console.assert(Array.isArray(data), "expected array, got %s", typeof(data))
    this.data = data
}

Series.prototype.show = function() { console.table(this.data) }

Series.prototype.eq = function(val)  { return new Series(this.data.map(e => e == val))}

Series.prototype.map = function(f) { return new Series(this.data.map(f)) } 

function Dataframe(data) {
    console.assert(Array.isArray(data), "expected array, got %s", typeof(data))
    console.assert(data.length > 0, "expected nonempty array")
    this.data = data
    let first = data[0]
    this.columns = Object.keys(first)
    this.columns.forEach(col => 
        this.__defineGetter__(
            col, 
            function() { 
                return new Series(this.data.map(d => d[col]))
            }
        )
    ) 
} 

Dataframe.prototype.show = function() {
    console.table(this.data, this.columns)
}
