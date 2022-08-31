var isChosen = false;   //Đã có quân cờ nào được chọn hay chưa
var chosenPiece = "";   //Khi một quân cờ được chọn, địa chỉ ô nó đang đứng (id) của nó sẽ được lưu vào đây
var turn = 1;
var chessboard = [        //Mảng xác định vị trí quân cờ của 2 đội, giá trị 1 là có quân cờ của đội đỏ,2 là đội xanh,
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],             // 0 là không có quân cờ nào, 8 là bàn cờ
    [8, 1, 1, 1, 1, 1, 1, 1, 1, 8],
    [8, 1, 1, 1, 1, 1, 1, 1, 1, 8],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 8],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 8],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 8],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 8],
    [8, 2, 2, 2, 2, 2, 2, 2, 2, 8],
    [8, 2, 2, 2, 2, 2, 2, 2, 2, 8],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
];
alert("Di chuyển quân cờ bằng cách click chuột\n Đội đỏ đi trước");
var allSquare = document.getElementsByClassName('square');
for (i = 0; i < allSquare.length; i++) {
    allSquare[i].addEventListener('click', function () {
        //Trường hợp chọn ô trống
        if (this.childElementCount == 0) {
            //Chưa có quân cờ nào được chọn trước đó -> Thông báo phải chọn quân cờ trước
            if (isChosen == false) {
                alert("Chọn quân cờ bạn muốn di chuyển trước");
            }
            //Đã chọn một quân cờ trước đó -> tiến hành di chuyển quân cờ được chọn tới vị trí ô này nếu thoả mãn điều kiện isMovable
            else {
                if (isMovable(chosenPiece, this.id) == true) {
                    movePiece(chosenPiece, this.id);
                }
                else {
                    alert("Vị trí ô không hợp lệ");
                }

            }

        }
        //Có quân cờ trong ô được chọn
        else {
            var team = parseInt(this.childNodes[0].className.substr(1, 2));
            //Nếu chưa có quân cờ nào được lựa chọn trước đó thì chỉ định nó làm quân cờ được chọn
            if (isChosen == false) {
                if (team == turn) {
                    chosenPiece = this.id;
                    if (showSuggestOf(chosenPiece) == 0) {
                        alert('Quân cờ này đang bị chặn không thể di chuyển được');
                    }
                    else {
                        isChosen = true;
                    }
                }
                else {
                    if (turn == 1)
                        alert("Bây giờ đang là lượt của đội đỏ");
                    else alert("Bây giờ đang là lượt của đội xanh");
                }
            }
            //Nếu đã có quân cờ được chọn trước đó -> tiến hành di chuyển quân cờ được chọn tới vị trí ô này nếu thoả mãn điều kiện isMovable
            else {
                if (this.id == chosenPiece) {
                    console.log("Huỷ bỏ di chuyển");
                    isChosen = false;
                    removeSuggest();
                }
                else {
                    if (isMovable(chosenPiece, this.id) == true) {
                        movePiece(chosenPiece, this.id);
                    }
                    else {
                        alert("Vị trí ô không hợp lệ");
                    }
                }

            }
        }

    });
}


//Hàm thực hiện hành động di chuyển quân cờ 
function movePiece(chosenPiece, desPos) {
    var temp = document.getElementById(chosenPiece).innerHTML;
    document.getElementById(chosenPiece).innerHTML = "";
    document.getElementById(desPos).innerHTML = temp;
    var curRow = parseInt(chosenPiece.substr(0, 1));
    var curCol = parseInt(chosenPiece.substr(2, 3));
    var desRow = parseInt(desPos.substr(0, 1));
    var desCol = parseInt(desPos.substr(2, 3));
    chessboard[desRow][desCol] = chessboard[curRow][curCol];
    chessboard[curRow][curCol] = 0;
    removeSuggest();
    isChosen = false;
    endGame();
    if (turn == 1) {
        turn = 2;
        document.getElementsByClassName('turn')[0].innerHTML = "Turn: <b style='color: blue;'>Blue</b>";
    }
    else {
        turn = 1;
        document.getElementsByClassName('turn')[0].innerHTML = "Turn: <b style='color: red;'>Red</b>";
    }
    //document.getElementById(chosenPiece).style.backgroundColor='rgb(255, 236, 179)';
}


//Kiểm tra xem quân cờ piece có thể di chuyển từ ô curPos đến ô cờ desPos không
function isMovable(curPos, desPos) {
    var pieceBox = document.getElementById(curPos);
    var piece = pieceBox.childNodes[0];
    var pieceType = piece.className.substr(3);
    var team = parseInt(piece.className.substr(1, 2));
    var row = parseInt(curPos.substr(0, 1));
    var col = parseInt(curPos.substr(2, 3));
    var listMovable;
    if (pieceType == 'pawn') {
        listMovable = ListMovablePawn(row, col, team);
    }
    else if (pieceType == 'rook') {
        listMovable = ListMovableRook(row, col, team);
    }
    else if (pieceType == 'knight') {
        listMovable = ListMovableKnight(row, col, team);
    }
    else if (pieceType == 'bishop') {
        listMovable = ListMovableBishop(row, col, team);
    }
    else if (pieceType == 'queen') {
        listMovable = ListMovableQueen(row, col, team);
    }
    else if (pieceType == 'king') {
        listMovable = ListMovableKing(row, col, team);
    }

    for (var i = 0; i < listMovable.length; i++) {
        if (listMovable.includes(desPos)) {
            return true;
        }
    }
    return false;
}


//Danh sách địa chỉ các ô mà quân tốt có thể di chuyển đến
function ListMovablePawn(row, col, team) {
    var arr = new Array();
    if (team == 1) {
        if (chessboard[row + 1][col - 1] == 2) {
            arr.push((row + 1) + '_' + (col - 1));
        }
        if (chessboard[row + 1][col + 1] == 2) {
            arr.push((row + 1) + '_' + (col + 1));
        }
        if (row == 2) {
            if (chessboard[3][col] == 0) {
                arr.push((3) + '_' + col);
            }
            if (chessboard[4][col] == 0) {
                arr.push((4) + '_' + col);
            }
        }
        else {
            if (chessboard[row + 1][col] == 0) {
                arr.push((row + 1) + '_' + col);
            }
        }
    }
    else {//Team 2
        if (chessboard[row - 1][col - 1] == 1) {
            arr.push((row - 1) + '_' + (col - 1));
        }
        if (chessboard[row - 1][col + 1] == 1) {
            arr.push((row - 1) + '_' + (col + 1));
        }
        if (row == 7) {
            if (chessboard[6][col] == 0) {
                arr.push((6) + '_' + col);
            }
            if (chessboard[5][col] == 0) {
                arr.push((5) + '_' + col);
            }
        }
        else {
            if (chessboard[row - 1][col] == 0) {
                arr.push((row - 1) + '_' + col);
            }
        }
    }
    return arr;
}


function ListMovableRook(row, col, team) {
    var listMovable = new Array();
    for (var i = row + 1; i <= 8; i++) {
        if (chessboard[i][col] == team) break;
        else if (chessboard[i][col] == 0) listMovable.push(i + '_' + col);
        else {
            listMovable.push(i + '_' + col);
            break;
        }
    }
    for (var i = row - 1; i >= 1; i--) {
        if (chessboard[i][col] == team) break;
        else if (chessboard[i][col] == 0) listMovable.push(i + '_' + col);
        else {
            listMovable.push(i + '_' + col);
            break;
        }
    }
    for (var i = col + 1; i <= 8; i++) {
        if (chessboard[row][i] == team) break;
        else if (chessboard[row][i] == 0) listMovable.push(row + '_' + i);
        else {
            listMovable.push(row + '_' + i);
            break;
        }
    }
    for (var i = col - 1; i >= 1; i--) {
        if (chessboard[row][i] == team) break;
        else if (chessboard[row][i] == 0) listMovable.push(row + '_' + i);
        else {
            listMovable.push(row + '_' + i);
            break;
        }
    }
    return listMovable;
}


function ListMovableKnight(row, col, team) {
    var listMovable = new Array();
    var i = row - 1;
    var j = col - 2;
    if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
        if (chessboard[i][j] != team) listMovable.push((i) + '_' + (j));
    }

    i = row - 2;
    j = col - 1;
    if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
        if (chessboard[i][j] != team) listMovable.push((i) + '_' + (j));
    }

    i = row - 2;
    j = col + 1;
    if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
        if (chessboard[i][j] != team) listMovable.push((i) + '_' + (j));
    }

    i = row - 1;
    j = col + 2;
    if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
        if (chessboard[i][j] != team) listMovable.push((i) + '_' + (j));
    }

    i = row + 1;
    j = col - 2;
    if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
        if (chessboard[i][j] != team) listMovable.push((i) + '_' + (j));
    }

    i = row + 2;
    j = col - 1;
    if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
        if (chessboard[i][j] != team) listMovable.push((i) + '_' + (j));
    }

    i = row + 2;
    j = col + 1;
    if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
        if (chessboard[i][j] != team) listMovable.push((i) + '_' + (j));
    }

    i = row + 1;
    j = col + 2;
    if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
        if (chessboard[i][j] != team) listMovable.push((i) + '_' + (j));
    }
    return listMovable;
}


function ListMovableBishop(row, col, team) {
    var listMovable = new Array();
    //Kiểm tra các ô chéo trên bên trái
    var i = row - 1;
    var j = col - 1;
    while (i >= 1 && j >= 1) {
        if (chessboard[i][j] == team) break;
        else if (chessboard[i][j] == 0) listMovable.push(i + '_' + j);
        else {
            listMovable.push(i + '_' + j);
            break;
        }
        i--;
        j--;
    }
    //Kiểm tra các ô chéo trên bên phải
    i = row - 1;
    j = col + 1;
    while (i >= 1 && j >= 1) {
        if (chessboard[i][j] == team) break;
        else if (chessboard[i][j] == 0) listMovable.push(i + '_' + j);
        else {
            listMovable.push(i + '_' + j);
            break;
        }
        i--;
        j++;
    }
    //Kiểm tra các ô chéo dưới bên trái
    i = row + 1;
    j = col - 1;
    while (i <= 8 && j <= 8) {
        if (chessboard[i][j] == team) break;
        else if (chessboard[i][j] == 0) listMovable.push(i + '_' + j);
        else {
            listMovable.push(i + '_' + j);
            break;
        }
        i++;
        j--;
    }
    //Kiểm tra các ô chéo dưới bên phải
    i = row + 1;
    j = col + 1;
    while (i <= 8 && j <= 8) {
        if (chessboard[i][j] == team) break;
        else if (chessboard[i][j] == 0) listMovable.push(i + '_' + j);
        else {
            listMovable.push(i + '_' + j);
            break;
        }
        i++;
        j++;
    }
    return listMovable;
}


function ListMovableKing(row, col, team) {
    var listMovable = new Array();
    if (chessboard[row - 1][col - 1] != team) listMovable.push((row - 1) + '_' + (col - 1));
    if (chessboard[row - 1][col] != team) listMovable.push((row - 1) + '_' + (col));
    if (chessboard[row - 1][col + 1] != team) listMovable.push((row - 1) + '_' + (col + 1));
    if (chessboard[row][col + 1] != team) listMovable.push((row) + '_' + (col + 1));
    if (chessboard[row + 1][col + 1] != team) listMovable.push((row + 1) + '_' + (col + 1));
    if (chessboard[row + 1][col] != team) listMovable.push((row + 1) + '_' + (col));
    if (chessboard[row + 1][col - 1] != team) listMovable.push((row + 1) + '_' + (col - 1));
    if (chessboard[row][col - 1] != team) listMovable.push((row) + '_' + (col - 1));
    return listMovable;
}


function ListMovableQueen(row, col, team) {
    var listMoveByStraight = ListMovableRook(row, col, team);
    var listMoveDiagonal = ListMovableBishop(row, col, team);
    var listMovable = listMoveByStraight.concat(listMoveDiagonal);
    return listMovable;
}


//Hiện gợi ý di chuyển và trả về số nước đi có thể di chuyển -> nếu số nước đi = 0 thì báo lỗi
function showSuggestOf(curPos) {
    var pieceBox = document.getElementById(curPos);
    var piece = pieceBox.childNodes[0];
    var pieceType = piece.className.substr(3);
    var team = parseInt(piece.className.substr(1, 2));
    var row = parseInt(curPos.substr(0, 1));
    var col = parseInt(curPos.substr(2, 3));
    var listMovable;
    if (pieceType == 'pawn') {
        listMovable = ListMovablePawn(row, col, team);
    }
    else if (pieceType == 'rook') {
        listMovable = ListMovableRook(row, col, team);
    }
    else if (pieceType == 'knight') {
        listMovable = ListMovableKnight(row, col, team);
    }
    else if (pieceType == 'bishop') {
        listMovable = ListMovableBishop(row, col, team);
    }
    else if (pieceType == 'queen') {
        listMovable = ListMovableQueen(row, col, team);
    }
    else if (pieceType == 'king') {
        listMovable = ListMovableKing(row, col, team);
    }

    var suggesClass = document.createElement("div");
    if (typeof listMovable =='undefined') return 0;
    for (var i = 0; i < listMovable.length; i++) {
        if (document.getElementById(listMovable[i]) != null) {
            var temp = document.getElementById(listMovable[i]).innerHTML;
            document.getElementById(listMovable[i]).innerHTML = temp + "<div class='suggest'></div>";
        }

    }
    
    return 1;
}


//Xoá tất cả các ô gợi ý
function removeSuggest() {
    var suggest = document.getElementsByClassName('suggest');
    var length = suggest.length;
    for (var i = 0; i < length; i++) {
        suggest[0].remove();
    }

}

function endGame() {
    var redKing = document.getElementsByClassName("p1 king")[0];
    var blueKing = document.getElementsByClassName("p2 king")[0];
    if (redKing == undefined) {
        alert("Trận đấu kết thúc - Đội xanh thắng");
        setTimeout("location.reload(true);", 1000);
    }
    if (blueKing == undefined) {
        alert("Trận đấu kết thúc - Đội đỏ thắng");
        setTimeout("location.reload(true);", 1000);
    }
}