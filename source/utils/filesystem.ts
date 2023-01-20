import { readFileSync, existsSync, writeFileSync, mkdirSync, rmSync } from "fs"

class FileSystem {
  public exists(path: string): boolean {
    return existsSync(path)
  }

  public writeToFile(path: string, data: string): void {
    try {
      writeFileSync(path, data)
    } catch(error) {
      throw error
    }
  }

  public mkdir(path: string): void {
    try {
      if (!this.exists(path)) {
        mkdirSync(path)
      }
    } catch(error) {
      throw error
    }
  }

  public removeFileOrDirectory(path: string): void {
    if (this.exists(path)) {
      rmSync(path, {"force": true, "recursive": true})
    } else {
      throw Error("File does not exists!")
    }
  }

  public readFileToString(path: string): string {
    let result = ""

    if (this.exists(path)) {
      result = readFileSync(path, {"encoding": "utf-8"})
    } else {
      throw Error("File does not exists!")
    }

    return result
  }

  public createPath(path: string): void {
    try {
      path.split("/").reduce((path, dir, index) => {
        const newPath = path + "/" + dir + "/"

        if (index === 1) this.mkdir(path)
        this.mkdir(newPath)

        return newPath
      })
    } catch(error){
      throw error
    }
  }

  public appendToFile(path: string, data: string): void {
    const oldData = this.exists(path) ? this.readFileToString(path) : ""
    const newData = oldData + data
    this.writeToFile(path, newData)
  }
}

export const fileSystem = new FileSystem()