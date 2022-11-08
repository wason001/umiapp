import React, { useState } from 'react';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import { history } from 'umi';

export default function Login() {

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const submit = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.status !== 200) {
        console.error(await res.text())
        return
      }
      const data = await res.json()
      alert(`欢迎回来, ${data.name}`)
      history.push('/posts/create')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="container lg:px-64 px-8 pt-16">
        <p className="text-3xl font-extrabold">用户登入</p>
        <div className="mt-8">
          <p>邮箱</p>
          <TextInput value={email} onChange={setEmail} />
          <p className="mt-4">密码</p>
          <TextInput value={password} onChange={setPassword} />
          <Button onClick={submit}>登入</Button>
        </div>
      </div>
    </div>
  );
}
