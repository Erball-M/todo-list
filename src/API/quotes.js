import { quotesData } from "../datas/quotesData";
import randomizer from "../utils/randomizer";

export function getRandomQuote() {
    return quotesData[randomizer(quotesData.length - 1)]
}