#!/usr/bin/env node
/*
 * Copyright (c) 2014 Gregor Richards
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

var fs = require("fs");
if (process.argv.length != 6) {
    console.log("Use: enc.js <aes.js> <password> <input file> <output file>");
    process.exit(1);
}

var aesjs   = process.argv[2];
var pw      = process.argv[3];
var ifile   = process.argv[4];
var ofile   = process.argv[5];

// get our AES
var aes = fs.readFileSync(aesjs, "utf-8");
eval(aes);

// encrypt it
var encrypted = CryptoJS.AES.encrypt(fs.readFileSync(ifile, "utf-8"), pw).toString();

// make the decryption page
var page = "<!doctype html><html><body><script type=\"text/javascript\">\n" +
           aes +
           "// CRYPTOJS CODE ENDS HERE\n" +
           "function go() {\n" +
           "var pw = document.getElementById(\"pw\").value;\n" +
           "document.open();\n" +
           "document.write(CryptoJS.AES.decrypt(\"" +
           encrypted +
           "\", pw).toString(CryptoJS.enc.Utf8));\n" +
           "document.close();\n" +
           "}\n" +
           "</script>\n" +
           "<form action=\"#\" onsubmit=\"go();\"><input type=\"password\" id=\"pw\" autofocus /></form>\n" +
           "</body></html>\n";

// and write it out
fs.writeFileSync(ofile, page);
