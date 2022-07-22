import {  Response } from 'express';

// Hilfs funktionen die Abfragen allgemein Vereinfachen
class Helper {

  // Parsed eine Int-Wert einer Query mit eine limt und einem möglichen ersatz
  public static parseQueryInt(query: Record<string, unknown>, valName: string, min: number, max: number, replace: number): number {
    // Falls query nicht existiert
    if (!query) {
      return replace;
    }
    // parse es als in den
    const val = parseInt(query[valName] as string);
    // Wenn es nicht geparsed werden konnte setz es auf einen Ersatz wert
    if (!val) {
      return replace;
    }
        // Wert zu groß
    if (val > max) {
      return max;
    }
    // Wert zu klein
    if (val < min) {
      return min;
    }
    // sonst gib wert zurücl
    return val;
  }


  public static valueExists<T>(obj: T, key: string | number | symbol, response: Response): key is keyof T {
    if (!(key in obj)) {
      response.status(400);
      response.send(`${ key.toString() } does not exist`);
      return false;
    }
    return true;
  }

  public static isString(value:unknown):boolean
  {
    return typeof value === 'string' || value instanceof String;
  }


  /**
   * generates a list of substrings of the input strings
   * if the ngram list of the search query and the list of the productname
   * overlap in any way the product is shown as a result of the seach query
   * @param word the input string from the searchquery or product name
   * @param minSize size of the string slices
   * @returns
   */
  public static ngram(word : string, minSize : number) : string[] {
    if( word.length <= minSize)
    {
      return [word];
    }
    const length = word.length;
    const startSizeRange = minSize;
    const endSizeRange = Math.max(length, minSize);
    const ngrams : string[] = [];
    for(let i = startSizeRange; i < endSizeRange; i++ )
    {
      for(let j = 0;j < Math.max(0, length - i) +1; j++)
      {
        ngrams.push(word.slice(j, j+i));
      }
    }
    return ngrams;
  }

  /**
   * the first substrings of word should get more weight when searching
   * @param word
   * @param minSize
   * @returns
   */
  public static prefixNgram(word : string, minSize : number) : string[] {
    const length = word.length;
    const prefixNgrams : string[] = [];
    const first = word.slice(0, minSize);
    prefixNgrams.push(first);
    for(let i = minSize; i < length; i++)
    {
      prefixNgrams.push(first + word.slice(minSize, i));
    }
    return prefixNgrams;
  }
}

/**
 * create error handle for a async function
 * @param fn function on which errors should be handled
 * @returns errorHandler(function(req,res))
 */


export default Helper;
