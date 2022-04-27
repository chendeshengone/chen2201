
    class Problem{

        // 请求的基础地址
        baseUrl='http://localhost:3000/problem'

        constructor(){

            // 调用获取数据的方法
            this.geTData();

            this.bindEve();



        }

        // 给按钮绑定事件
        bindEve(){

            // 节点的点击事件的回调函数中的this指向当前节点，通过bind改变this指向当前实例化对象
            Problem.$$('#seve-data').addEventListener('click',this.seveData.bind(this))


            // 给tbody绑定事件，事件委托，将所有的删除按钮的事件委托给tbody
            Problem.$$('.content tbody').addEventListener('click',this.setData.bind(this))


            // 给修改的保存，绑定点击事件
            Problem.$$('#modify-data').addEventListener('click',this.modifyData.bind(this))


            // 给ul绑定点击事件
            Problem.$$('.pagination').addEventListener('click',this.setPage.bind(this))


            // 给删除模态框的确定按钮绑定点击事件
            Problem.$$('#delSure').addEventListener('click',this.delSure.bind(this))

        }

        // tbody点击事件的回调方法
        setData(event){

            // console.log(this);
            // console.log(event.target);
            // console.log(event.target.id);  //获取id

            // 判断id，获取当前的按钮,为delData的就是删除按钮
            if(event.target.id=='delData') this.delData(event.target)

            // 判断id，如果id为modifyData，表示点击的是修改按钮
            if(event.target.id=='modifyData') this.updateData(event.target)

        }

        // 修改数据
        updateData(target){
            // console.log(target);

            // 打开修改模态框
            $('#modifyModal').modal('show')

            // 获取tr内容
            let trObj=target.parentNode.parentNode;
            // console.log(trObj);

            let child=trObj.children;
            // console.log(child);

            // 获取id,title,pos,idea
            let id=child[0].innerHTML;
            let title=child[1].innerHTML;
            let pos=child[2].innerHTML;
            let idea=child[3].innerHTML;

            // console.log(id,title,pos,idea);

            // 把原本的内容放到模态框中
            // console.log(document.forms[1].elements);
            let form=document.forms[1].elements;

            // 添加内容
            form.title.value=title;
            form.pos.value=pos;
            form.idea.value=idea;
            // 将id放在input中，不能修改的
            form.id.value=id;


        }


        // 保存修改的数据
        modifyData(){

            // console.log(document.forms[1].elements);

            // 获取模态框内的内容
            let ele=document.forms[1].elements;

            // 清除空
            let id=ele.id.value.trim();
            let title=ele.title.value.trim();
            let pos=ele.pos.value.trim();
            let idea=ele.idea.value.trim();

            // console.log(id,pos,idea);

            // 判断为空
            if(!title  ||  !pos  ||  !idea){
                throw new TypeError('不能为空白！！')
            }

            // 发送Ajax请求，将数据更新到json中
            // 变量名和属性名一致，可以直接写变量名
            axios.patch(this.baseUrl+'/'+id,{
                title,
                pos,
                idea
            }).then(
                location.reload()
            )

        }



        // 删除数据
        // delData(target){

        //     // console.log(event.target);
        //     let trObj=target.parentNode.parentNode;
        //     // console.log(trObj);

        //     // 获取data-id值，用于发送Ajax
        //     // console.log(trObj.dataset.id);

        //     let id=trObj.dataset.id;

        //     // 通过ajax发送请求删除数据
        //     axios.delete(this.baseUrl+'/'+id).then(data=>{
                
        //         if(data.status==200){
        //             trObj.remove();
        //         }

        //     })

        // }

        // 使用模态框提示删除
        delData(target){

            this.target=target;
            // 弹出模态框
            $('#delModal').modal('show')

        }

        // 删除模态框的确定按钮
        async delSure(){

            // 获取当前点击删除的对应节点tr
            let trObj=this.target.parentNode.parentNode;
            // console.log(trObj);

            // console.log(111);
            // console.log(this.target);

            // 获取id
            let id=trObj.dataset.id;
            // console.log(id);


            // 保留当前类名是active的页码
            // let newPage=Problem.$$('.active').firstElementChild.innerHTML;
            // console.log(newPage);


            // 通过ajax发送请求删除
            await axios.delete(this.baseUrl+'/'+id).then(data=>{

                if(data.status==200){

                    // location.reload();
                    trObj.remove();

                    // 关闭模态框
                    $('#delModal').modal('toggle')

                }

            })

            // this.geTData(newPage);   

            

        }



        // 点击保存按钮回调的方法
        seveData(){

            // console.log(this);
            // 获取页面中的表达内容
            let form=document.forms[0];

            // console.log(form.elements);

            // 结构title,idea,pos三个属性  获取输入内容
            let { title,idea,pos }=form.elements;
            // console.log(title,idea,pos);
            // console.log(title.value);

            // 判断输入内容是否为空
            if(!pos.value.trim()  ||  !idea.value.trim()  ||  !title.value.trim())  throw new Error('不能为空！')


            // 不为空则添加到json中

            axios.post(this.baseUrl, {
                title:title.value,
                idea:idea.value,
                pos:pos.value
              }).then(({status})=>{
                  
                if(status==201){
                    location.reload();
                }

              });


        }
        

        
        // 获取数据的方法
        async geTData(page=1){

            // 1  获取数据
            let {data,status,headers}=await axios.get(this.baseUrl+'?'+'_page='+page+'&_limit=5')
            let limit=5;
            // console.log(data,status);

            // 1-1 当属性为变量时  才用[]  获取页面内共有多少条
            // console.log(headers['x-total-count']);
            // 1-2 计算页面内要显示几页
            this.countPage=Math.ceil(headers['x-total-count']/limit)
            // 1-3 分页li的显示
            let pageHtml=`<li>
            <a href="#none" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
            </li>`;
            // 循环
            for(var i=1;i<=this.countPage;i++){

                pageHtml+=`<li  class="${page==i && 'active'}"><a href="#">${i}</a></li>`;

            }
            pageHtml+=`<li>
            <a href="#none" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            </a>
            </li>`
            Problem.$$('.pagination').innerHTML=pageHtml;




            // 2  判断返回值状态
            if(status != 200) throw new Error('数据错误')


            // 3  将数据遍历，追加到页面中
            // console.log(data);

            let tr='';
            data.forEach(ele=>{

                tr+=`<tr data-id=${ele.id}>
                <th scope="row">${ele.id}</th>
                <td>${ele.title}</td>
                <td>${ele.pos}</td>
                <td>${ele.idea}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-default btn-xs" id="modifyData">修改</button>
                    <button type="button" class="btn btn-danger btn-default btn-xs" id="delData">删除</button>
                </td>
              </tr>`;

            });

            // console.log(tr);

            let tbody=Problem.$$('tbody').innerHTML=tr;
            // console.log(tbody);

        }


        setPage(event){
            // console.log(event.target.nodeName);
            let target=event.target;

            if(target.nodeName=='A'){

                // 获取的是字符串，-0会变成NaN
                // console.log(target.innerHTML-0);
                if(target.innerHTML-0){

                    // 点击的如果是数字，-0是数字，为true
                    // 传递页码
                    this.geTData(target.innerHTML)
                    return;
                    
                }

                // 点击的是上一页或者下一页

                this.nextPrevious(target)

            }


            // 判断是不是span
            if(target.nodeName=='SPAN'){

                // 找到父级
                let aObj=target.parentNode;
                // console.log(aObj);

                this.nextPrevious(aObj)

            }

        }

        nextPrevious(aObj){
            // 获取当前的active的页码
            let curPage=Problem.$$('.active').firstElementChild.innerHTML;

            // 判断是否是下一页
            if(aObj.getAttribute('aria-label')=='Next'){

                // console.log(Problem.$$('.active'));
                
                // 判断是否是最后一页
                if(curPage==this.countPage) return;

                ++curPage

            }else if(aObj.getAttribute('aria-label')=='Previous'){// 判断是否是上一页
                // 判断是否是第一页
                if(curPage==1) return;

                --curPage
            }
            this.geTData(curPage)

        }


        // 封装获取节点的方法
        static $$(ele,all=false){
            return all ? document.querySelectorAll(ele):document.querySelector(ele)
        }

    }


    new Problem;


