Array.prototype.random = function()
{
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.last = function()
{
    if(this.length === 0)
        return this[0];
        
    return this[this.length-1];
};

String.prototype.contains = function(needle, position)
{
    if(typeof needle === 'object')
        return needle.includes(this.toString());    
  
    return this.includes(needle, position);
};

Array.prototype.indexes = function(type = 'center')
{
    if(this.constructor.name !== 'Array' || this.length === 0)
        return [];

    const middles = ['center', 'middle', '<>', '|'];
    const rights = ['right', '<', 'end', 'last'];
    const lefts = ['left', '>', 'start', 'first'];

    let isMiddle = type.contains(middles);
    let isRight = isMiddle == false && type.contains(rights);
    let keys = Object.keys(this);

    if(((isMiddle && isRight) === false) && type.contains(lefts) || this.length === 1)
        return keys;
    else if(isRight || this.length === 2)
        return keys.reverse();
    else if(!isMiddle)
        return this;

    let initIndex = Math.floor(this.length / 2);
    let result = [];

    for(let i = 0; i < this.length; i++)
        if(i === 0)
            result.push(keys[initIndex]);
        else
        {
            if(initIndex-i >= 0)
                result.push(keys[initIndex-i]);
            
            if(initIndex+i < this.length)
                result.push(keys[initIndex+i]);
        }
                
    return result;
};

Array.prototype.order = function(needle)
{
    if(typeof needle === 'object')
        return needle.reduce((acc, cur) =>
        {
            acc.push(this[cur]);
            return acc;
        }, []);
    else if(typeof needle === 'string')
        return this.order(this.indexes(needle));
};

Array.prototype.eachTime = function(cb, interval = 20, run)
{
    return new Promise((resolve) => {
        if(typeof cb === 'number' && typeof interval === 'function')
            [cb, interval] = [interval, cb];

        let idx = 0;

        if(run)
            cb(this[0], 0, this, interval), idx++;

        function end(handle)
        {
            clearInterval(handle);
            resolve(this, this[idx], idx, interval);
        }

        let handle = setInterval((element, index, array) =>
        {
            if(idx >= this.length)
                return end(handle);

            if(cb(this[idx], idx, array, interval) === false)
                return end(handle);
                
            idx++;
        }, interval, this[idx], idx, this, interval);
    });
};

/**
 * Closes the number between a range.
 * 
 * @param {Number} min 
 * @param {Number} max 
 * @returns the value between the range.
 */
Number.prototype.close = function(min, max)
{
    if(this < min)
        return min;
    else if(this > max)
        return max;
    else
        return this;
};

/**
 * 
 * @returns true if the number has decimals.
 */
Number.prototype.hasDecimals = function()
{
    return this % 1 > 0;
};

String.prototype.readAsTextFile = async function()
{
    return await fetch(this.toString()).then(r => r.text()).then(r => r).catch(r => '');
};

Object.prototype.isEmpty = function()
{
    return this.values().length === 0;
}

Object.prototype.isNotEmpty = function()
{
    return !this.isEmpty();
}

Object.prototype.extract = function(expr, del = '>')
{
    if(typeof expr !== 'string' || typeof del !== 'string')
        return undefined;

    return expr.split(del).reduce((acc, item) =>
    {
        if(typeof acc[item] === 'function')
            return acc[item]();
        else
            return acc[item];

    }, this);
};