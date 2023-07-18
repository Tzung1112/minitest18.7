import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
import multiparty from "multiparty"
router.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, "list.json"), (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lay meo that bai1"
            })
        }
        return res.status(200).json({
            message: "lay list thanh cong",
            data: JSON.parse(data)
        })
    })
})
router.delete('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "list.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy meos thất bại!"
                })
            }
            let meos = JSON.parse(data);
            meos = meos.filter(meo => meo.id != req.params.id);

            fs.writeFile(path.join(__dirname, "list.json"), JSON.stringify(meos), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                 return res.status(200).json(
                        {
                            message: "Xóa thành công!"
                        }
                    )
                

            })
        })
    } else {
        return res.status(500).json(
            {
                message: "Vui lòng truyền id!"
            }
        )
    }
})
router.post("/", (req, res) => {
    let form = new multiparty.Form();
    form.parse(req,(err,fields,files)=>{
       if(err){
        return res.status(500).send("Doc form loi");
       } 
       console.log(fields);
        let newTodo = {
            id: Date.now(),
           title: fields.title[0],
            completed: false
        }
        fs.readFile(path.join(__dirname, "list.json"), (err, data) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "doc du lieu that bai"
                    }
                )
            }
            let oldData = JSON.parse(data);
            oldData.unshift(newTodo)
            fs.writeFile(path.join(__dirname, "list.json"), JSON.stringify(oldData), (err) => {
                if (err) {
                    return res.status(500).json(
                        { message: "Ghi file that bai" }
                    )
                }
                return res.redirect("/lists")
            })
        })
    })
})
router.patch('/:id', (req, res) => {
    // console.log(req.body)
    if (req.params.id) {
        let flag = false;
        fs.readFile(path.join(__dirname, "list.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy todos thất bại!"
                })
            }
            let todos = JSON.parse(data);

            todos = todos.map(todo => {
                if (todo.id == req.params.id) {
                    flag = true;
                    return {
                        ...todo,
                        ...req.body
                    }
                }
                return todo
            })

            fs.writeFile(path.join(__dirname, "list.json"), JSON.stringify(todos), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json(
                    {
                        message: "Patch todo thanh cong"
                    }
                )
            })
        })
    }
    
})
module.exports = router;