// PlayfairCipherPage.js
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Nav } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import "./PlayfairCipherPage.css"; // Import the CSS file

let a = "A";
// Playfair cipher logic
const string = {
        isString: function(input) {
            return ((typeof input) == "string");
        },
    
        removeNonAlphabet: function (input) {
            return input.replace(/[^a-zA-Z]/gi, '').toUpperCase();
        },
    
        removeNonAlphabetException: function (input) {
            return input.replace(/[^a-zA-Z?]/gi, '').toUpperCase();
        },
    
        removeNonAlphabetHill: function (input) {
            return input.replace(/[^a-zA-Z?#]/gi, '').toUpperCase();
        },
    
        removeDuplicates: function(input) {
            return input.split('').filter(function (char, pos, self) {
                return self.indexOf(char) == pos;
            }).join('');
        },
    
        replaceCharacters: function(input, search, replace) {
            let regex = new RegExp(search, "gi");
            return input.replace(regex, replace.toUpperCase());
        },
    
        toNumbers: function(input) {
            input = this.removeNonAlphabet(input);
            let out = [];
            for (let i = 0; i < input.length; i++) {
                out.push(input.charCodeAt(i) - a.charCodeAt(0));
            }
            return out;
        },
    
        toNumbersException: function(input) {
            input = this.removeNonAlphabetException(input);
            let out = [];
            for (let i = 0; i < input.length; i++) {
                out.push(input.charCodeAt(i) - a.charCodeAt(0));
            }
            return out;
        },
    
        toNumbersHill: function (input) {
            input = this.removeNonAlphabetHill(input);
            let out = [];
            for (let i = 0; i < input.length; i++) {
                if (input[i] === "?") {
                    out.push(26);
                } else if (input[i] === "#") {
                    out.push(27);
                } else {
                    out.push(input.charCodeAt(i) - a.charCodeAt(0));
                }
            }
            return out;
        },
    
        toASCII: function(input) {
            let out = [];
            for (var i = 0; i < input.length; i++) {
                out.push(input.charCodeAt(i));
            }
            return out;
        },
    
        toAlphabet: function(input) {
            let out = "";
            for (let i = 0; i < input.length; i++) {
                if (input[i] === 63) {
                    out += String.fromCharCode(input[i]);
                } else {
                    out += String.fromCharCode(input[i] + a.charCodeAt(0));
                }
            }
            return out;
        },
    
        toAlphabetHill: function(input) {
            let out = "";
            for (let i = 0; i < input.length; i++) {
                if (input[i] === 26) {
                    out += "?";
                } else if (input[i] === 27) {
                    out += "#";
                } else {
                    out += String.fromCharCode(input[i] + a.charCodeAt(0));
                }
            }
            return out;
        },
    
        mod: function(a, b) {
            let res = a % b;
            return Math.floor(res >= 0 ? res : this.mod(a + b, b));
        },
    
        modInverse: function (m, n) {
            const s = [];
            let b = n;
            while (m < 0) m += n;
            while (b) {
                [m, b] = [b, m % b];
                s.push({ m, b });
            }
            if (m !== 1) {
                return NaN;
            } else {
                let x = 1;
                let y = 0;
                for (let i = s.length - 2; i >= 0; --i) {
                    [x, y] = [y, x - y * Math.floor(s[i].m / s[i].b)];
                }
                return (y % n + n) % n;
            }
        },
    
        bigram: function(input) {
            input = this.removeNonAlphabet(input);
            let pos = 0;
            let tempDigram = "";
            let out = [];
            while (pos < input.length) {
                if (tempDigram.length == 0) {
                    tempDigram += input.charAt(pos);
                } else if (tempDigram.length == 1) {
                    if (tempDigram.charAt(0) == input.charAt(pos)) {
                        tempDigram += "X";
                        pos--;
                    } else {
                        tempDigram += input.charAt(pos);
                        out.push(tempDigram);
                        tempDigram = "";
                    }
                } else {
                    out.push(tempDigram);
                    tempDigram = "";
                    tempDigram += input.charAt(pos);
                }
                if ((input.length % 2) != 0 && pos == (input.length - 1) && (tempDigram.length % 2) != 0) {
                    tempDigram += "X";
                    out.push(tempDigram);
                } else if (pos == (input.length - 1) && tempDigram.length != 0) {
                    tempDigram = input.charAt(pos) + "X";
                    out.push(tempDigram);
                }
                pos++;
            }
            return out;
        },
    
        formatOutput: function(input, n) {
            let out = "";
            for (let i = 0; i < input.length; i += n) {
                out += input.substr(i, n) + " ";
            }
            return out;
        }
};
    


const PlayfairCipherPage = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [isEncrypt, setIsEncrypt] = useState(true);

  const generateKey = (key) => {
    key = string.removeNonAlphabet(key);
    key = string.replaceCharacters(key, "J", "");

    let i = 0;
    let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    let secretKey = string.removeDuplicates(key + alphabet);

    let matrix = new Array(5);

    for (let j = 0; j < matrix.length; j++) {
      matrix[j] = new Array(5);
    }

    for (let k = 0; k < matrix.length; k++) {
      for (let l = 0; l < matrix[k].length; l++) {
        matrix[k][l] = secretKey[i];
        i++;
      }
    }

    return matrix;
  };

  const getPos = (matrix, input) => {
    let out = new Array(2);
    let i = 0;
    let found = false;

    while (!found && i < matrix.length) {
      let j = 0;

      while (!found && j < matrix[i].length) {
        if (matrix[i][j] === input) {
          out[0] = i;
          out[1] = j;
          found = true;
        } else {
          j++;
        }
      }

      i++;
    }

    return out;
  };

  const playfairEncrypt = (plaintext, key) => {
    if (string.isString(plaintext) && string.isString(key)) {
      plaintext = string.removeNonAlphabet(plaintext).toUpperCase();
      key = string.removeNonAlphabet(key).toUpperCase();

      let out = [];
      let P = string.bigram(plaintext);
      let K = generateKey(key);

      for (let i = 0; i < P.length; i++) {
        let pos1 = getPos(K, P[i][0]);
        let pos2 = getPos(K, P[i][1]);

        if (pos1[0] === pos2[0]) {
          out.push(
            K[pos1[0]][string.mod(pos1[1] + 1, 5)] +
            K[pos2[0]][string.mod(pos2[1] + 1, 5)]
          );
        } else if (pos1[1] === pos2[1]) {
          out.push(
            K[string.mod(pos1[0] + 1, 5)][pos1[1]] +
            K[string.mod(pos2[0] + 1, 5)][pos2[1]]
          );
        } else {
          out.push(K[pos1[0]][pos2[1]] + K[pos2[0]][pos1[1]]);
        }
      }

      return out.join("");
    } else {
      return "INPUT ERROR";
    }
  };

  const playfairDecrypt = (ciphertext, key) => {
    if (string.isString(ciphertext) && string.isString(key)) {
      let out = [];
      let C = string.bigram(ciphertext);
      let K = generateKey(key);

      for (let i = 0; i < C.length; i++) {
        let pos1 = getPos(K, C[i][0]);
        let pos2 = getPos(K, C[i][1]);

        if (pos1[0] === pos2[0]) {
          out.push(
            K[pos1[0]][string.mod(pos1[1] - 1, 5)] +
            K[pos2[0]][string.mod(pos2[1] - 1, 5)]
          );
        } else if (pos1[1] === pos2[1]) {
          out.push(
            K[string.mod(pos1[0] - 1, 5)][pos1[1]] +
            K[string.mod(pos2[0] - 1, 5)][pos2[1]]
          );
        } else {
          out.push(K[pos1[0]][pos2[1]] + K[pos2[0]][pos1[1]]);
        }
      }

      return out.join("");
    } else {
      return "INPUT ERROR";
    }
  };

  const handleEncrypt = () => {
    setResult(playfairEncrypt(text, key));
  };

  const handleDecrypt = () => {
    setResult(playfairDecrypt(text, key));
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="card">
            <Card.Body>
              <Nav variant="tabs"></Nav>
              <h2>Playfair Cipher Calculator</h2>
              <Form>
                <Form.Group controlId="text" className="form-group">
                  <Form.Label>
                    <strong>{isEncrypt ? 'Plaintext : ' : 'Ciphertext : '}</strong>
                  </Form.Label>
                  <Form.Control
                    className="formInput"
                    as="textarea"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="key" className="form-group">
                  <Form.Label>Key:</Form.Label>
                  <Form.Control
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </Form.Group>
                <br />
              </Form>
              <div>
                <Button
                  className={`custom-button ${isEncrypt ? 'active' : ''}`}
                  onClick={() => {
                    setIsEncrypt(true);
                    handleEncrypt();
                  }}
                >
                  Encrypt
                </Button>
                <Button
                  className={`custom-button ${!isEncrypt ? 'active' : ''}`}
                  onClick={() => {
                    setIsEncrypt(false);
                    handleDecrypt();
                  }}
                >
                  Decrypt
                </Button>
              </div>
              {result && (
                <div className="result-container mt-3">
                  <p>
                    <strong>{isEncrypt ? 'Ciphertext : ' : 'Plaintext : '}</strong>
                  </p>
                  <p className="result-text">{result}</p>
                  <CopyToClipboard className="copy-button" text={result}>
                    <Button variant="success">Copy to Clipboard</Button>
                  </CopyToClipboard>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlayfairCipherPage;