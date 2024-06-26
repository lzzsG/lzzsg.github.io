# 二. 创建项目

## 前言

创建项目是构建任何软件项目的第一步，尤其是在涉及到具体硬件平台的裸机编程时，这一步骤的重要性更是不言而喻。在这一阶段，我们将通过Cargo工具为我们的项目搭建起一个基本的框架，包括项目的目录结构、配置文件，以及一些初步的代码文件。我们将特别关注于配置项目以适应裸机环境的特殊需求，这包括选择库项目还是二进制项目、配置裸机环境特有的属性，以及准备启动代码等关键活动。

所谓的基于RISC-V和Rust进行裸机编程的通用流程，其实没有非常明显的界限。在创建项目这一阶段过程中，我们会遇到许多与后续步骤相关的配置和决策点。例如，我们在此阶涉及的启动代码属于编写启动代码阶段，同样将在编译和链接过程中发挥作用，为程序的正确执行提供支持。同时，我们设置的目标架构、构建脚本`build.rs`，以及`.cargo/config.toml`中的各种配置选项，都将直接影响到后续的编译和链接过程。

通过在项目创建阶段做出明智的选择和配置，我们可以为项目的成功打下坚实的基础。这些早期的决策将确保我们的编译、链接，甚至是最终在目标平台上运行的过程，能够顺利进行。因此，尽管创建项目看似是一个简单的起点，但它实际上蕴含了整个开发流程的关键要素，需要我们给予充分的重视。

> 所谓的【基于RISC-V和Rust进行裸机编程的通用流程】，是我为了方便自己学习理解，特意让GPT给出的整理后看上去比较像通用流程的版本🙂

### 结构概览

接下来，我们将详细讨论创建项目阶段的各个环节，从库项目与二进制项目的选择，到特殊属性的应用，以及启动代码的准备。我们还将深入探讨配置目标架构的方法、`build.rs`构建脚本的作用，以及如何通过`.cargo/config.toml`和命令行参数定制化我们的构建过程。每一部分都是构建成功裸机程序的重要组成部分，为后续步骤奠定基础。

通过本节内容的讲解，我们希望读者能够清晰地理解创建项目阶段的复杂性和其对整个项目开发流程的影响。这不仅仅是关于如何开始一个项目的简单指南，更是对未来步骤的准备和预见。

---

下面详细解释这一步骤的知识点和操作流程。

### 使用Cargo创建项目

- **Cargo**：Rust的包管理器和构建工具，用于创建、构建和管理Rust项目。Cargo处理依赖管理、编译过程，并允许发布库到 [crates.io](https://crates.io/)。

- **创建库项目**：裸机项目通常不使用Rust的标准库（std），因此推荐创建一个库项目（lib），而不是一个二进制项目（bin）。这可以通过Cargo命令轻松完成：

  ```powershell
  cargo new --lib project_name
  ```

  这一命令会生成一个新的项目目录，包含基础的项目结构和`Cargo.toml`配置文件。

### 配置Cargo.toml

- **指定不使用标准库**：在裸机编程中，由于没有操作系统支持，因此需要在`Cargo.toml`中指定不使用Rust的标准库。这通过添加`#![no_std]`属性在项目的根文件（通常是`lib.rs`或`main.rs`）中完成。
- **配置目标架构**：你还需要在`Cargo.toml`中指定构建目标和优化级别，这些可以通过设置目标三元组和调整`profile`来实现。例如，为了针对RISC-V 32位架构优化，你可能需要添加相应的目标配置。

### 编写裸机应用的基础代码

> 第三步

- **添加启动代码**：裸机应用需要一个入口点，这通常是一个名为`_start`的函数。由于Rust默认会寻找一个名为`main`的函数作为程序入口，裸机编程需要绕过这一行为，直接使用`_start`作为入口点，并使用`#[no_mangle]`属性来避免名称修饰，确保链接器可以正确识别入口点。

  ```rust
  #![no_std]
  #![no_main]
  
  #[no_mangle]
  pub extern "C" fn _start() -> ! {
      loop {}
  }
  ```

- **配置裸机环境特有的属性**：由于缺乏标准库，一些在普通Rust环境下默认可用的功能（如panic处理器）在裸机环境下需要手动配置。

### 配置构建脚本和工具链

- **编写构建脚本**：为了在裸机环境下构建项目，可能需要编写自定义的`build.rs`构建脚本，用于调整编译选项或进行条件编译。
- **配置`.cargo/config.toml`**：可以在`.cargo/config.toml`中为特定目标指定默认的链接器和其他构建参数，这对于交叉编译至关重要。
  - 或者通过**命令行和环境变量`RUSTFLAGS`**来传递这些参数，这对于一次性构建或特定构建环境（如CI/CD）非常方便。

### 小结

创建项目是开发裸机应用的基础，它涉及到使用Cargo工具、配置项目以适配裸机环境、编写适合裸机启动的代码结构等关键活动。理解这些步骤和配置的目的及其背后的原理对于成功开发RISC-V裸机应用至关重要。随着项目的建立，接下来的步骤将涉及到编写具体的应用逻辑、构建、链接和在目标硬件上运行程序，这些将在后续的内容中继续讲解。

---

## 展开讲解

### 1. 库项目还是二进制项目的选择原因

在Rust中，项目可以是库（lib）或二进制（bin）项目。库项目被设计为提供可重用的代码，而二进制项目产生可执行文件。

- **库项目**：裸机编程通常选择库项目，因为这允许开发者更灵活地定义程序的入口点（如`_start`函数），而不是默认的`main`函数。库项目便于在不同环境下重用代码，特别是在需要精确控制启动过程和执行环境的裸机应用中。
- **二进制项目**：虽然也可以用于裸机编程，但它默认期望有`main`函数作为程序入口，这在没有标准库支持的环境中通常不适用。

### 2. 特殊属性的含义及使用场景/配置裸机环境特有的属性

在Rust中，特殊属性（attributes）提供了与编译器交互的方式，用于改变编译过程或指示编译器特殊处理某些部分的代码。

裸机环境缺乏操作系统支持，因此需要通过特定的属性来配置环境。以下是一些重要的属性及其用法：

- **#![no_std]**：这个属性禁用Rust标准库（std），转而使用Rust核心库（core），后者为裸机或操作系统开发提供了最基本的抽象。使用`#![no_std]`是因为标准库依赖操作系统层面的功能，这在裸机环境中不可用。

- **#![no_main]**：禁用Rust默认的入口点查找机制，允许开发者自定义入口点。在裸机应用中，操作系统不会调用`main`函数，所以需要明确地标记不使用Rust的标准入口点机制。

  - **#![no_std]** 和 **#![no_main]**:这些属性被放在源代码的根文件（通常是`lib.rs`或`main.rs`）的顶部，使用`#![attribute]`语法应用于整个crate。

  - ```rust
    #![no_std]
    #![no_main]
    ```

- **#[no_mangle]**：这个属性用于防止Rust编译器更改函数的名称（名字修饰），确保函数名在编译后的二进制文件中保持不变。在定义自定义入口点（如`_start`）时非常重要，因为链接器需要准确识别这一入口点。

  - 应用于函数声明之前，防止编译器改变该函数的名称。使用`#[attribute]`语法应用于单个项。

  - ```rust
    #[no_mangle]
    pub extern "C" fn _start() -> ! {
        // 启动代码
    }
    ```

- **#[panic_handler]**：定义panic处理函数。在禁用标准库的情况下，Rust要求你提供一个处理panic的函数，因为默认的panic行为依赖于标准库。这个函数需要接受一个`&PanicInfo`参数，并且永远不返回（返回类型为`!`）：

  ```rust
  use core::panic::PanicInfo;
  
  #[panic_handler]
  fn panic(_info: &PanicInfo) -> ! {
      // 在这里定义panic时的行为
      loop {}
  }
  ```

- **#[alloc_error_handler]**：如果你的程序使用了堆分配（通过`alloc` crate），则必须定义一个错误处理函数，来处理分配失败的情况。这适用于那些即使在裸机环境中也需要使用动态内存分配的应用。

### 3. 启动代码相关内容进一步讲解

启动代码（也称为启动序列或引导代码）是裸机应用程序中非常关键的一部分，它负责初始化硬件和设置必要的运行时环境，然后跳转到应用程序的主逻辑。

#### 启动代码的职责

- **初始化硬件**：包括设置时钟、配置内存、初始化外设等。
- **设置堆栈指针**：为程序运行提供堆栈空间。
- **调用全局构造函数**：如果有的话，比如在C++中。
- **跳转到主程序**：设置完环境后，跳转到程序的主逻辑开始执行。

#### 示例

在Rust中，启动代码可能看起来像这样：

```rust
#[no_mangle]
pub extern "C" fn _start() -> ! {
    // 硬件初始化代码

    // 设置堆栈指针
    // asm!("mov sp, {}", val(stack_top));

    // 跳转到主程序逻辑
    main();

    loop {}
}

// 假设这是你的主程序逻辑
fn main() {
    // 主程序代码
}
```

> 这里的`main`并不是传统意义上的程序入口点，而是为了说明如何从自定义的入口点（如`_start`）跳转到程序的主要部分。在这种情况下，`main`只是一个普通的函数，不是特定于二进制项目的入口点。这种模式通常用于裸机编程，特别是在不依赖标准库的库项目中，开发者需要明确定义自己的程序入口逻辑。

由于`#![no_std]`的使用，标准库不可用，因此你需要用`core`库或自定义的库来替代标准库的功能。

启动代码是裸机应用开发中至关重要的部分，需要开发者对目标硬件有深入的了解。正确地编写和配置启动代码是确保程序能够正确执行的关键。

### 4. 配置目标架构的方法和目标架构命名约定

配置目标架构意味着指示编译器为特定的硬件平台生成代码。这在裸机编程和交叉编译中尤其重要。

- **配置方法**：可以通过`rustup target add <target>`命令添加新的编译目标。此外，在项目的`.cargo/config.toml`文件中设置`[build] target`值也是常用方法。
- **Rust目标架构命名约定**：Rust使用特定的格式来指代目标架构，格式通常为`<arch><sub>-<vendor>-<sys>-<abi>`。
  - **arch**：指的是CPU架构，如`riscv64`表示RISC-V 64位。
  - **sub**：架构的子类型，如`gc`表示具有“G”整数和“C”压缩指令的RISC-V。
  - **vendor**：制造商，对于跨平台目标通常是`unknown`。
  - **sys**：系统类型，裸机通常是`none`表示没有操作系统。
  - **abi**：二进制接口，如`elf`表示使用ELF格式。

#### 示例

- riscv64gc-unknown-none-elf：
  - `riscv64`：64位RISC-V架构。
  - `gc`：支持“G”和“C”扩展。
  - `unknown`：未指定制造商。
  - `none`：没有操作系统。
  - `elf`：使用ELF格式的二进制接口。
- 其他可能示例：
  - **thumbv7em-none-eabi**：适用于没有操作系统的ARM Cortex-M4/M7设备，使用EABI。
  - **aarch64-unknown-none**：针对未指定制造商的裸机环境的64位ARM架构。

### 5. `build.rs`构建脚本、命令行构建 和`.cargo/config.toml`

> `link_riscv32.x` ,`link_riscv64.x` 和 `src/linker.ld` 都是链接脚本的示例。

- **`build.rs`构建脚本**：是一个独立的Rust程序，Cargo在编译你的项目之前会执行它。这个脚本可以用来执行一些自动化的构建任务，比如代码生成、自动化修改`Cargo.toml`、添加编译标志等。在裸机项目中，`build.rs`可以用来设置特定的编译器标志或环境变量，这些可能对目标平台至关重要。

  - 使用`build.rs`的一个示例场景是，当你需要根据不同的目标平台来调整编译选项时，你可以在`build.rs`中检查目标架构，并据此设置相应的编译标志。

  - 用法：在项目根目录下创建一个`build.rs`文件，并在其中定义构建逻辑。Cargo会在每次构建项目时自动执行此脚本。

  - ```rust
    use std::env;
    
    fn main() {
        let target = env::var("TARGET").unwrap();
        if target.contains("riscv32") {
            println!("cargo:rustc-link-arg=-Tlink_riscv32.x");
        } else if target.contains("riscv64") {
            println!("cargo:rustc-link-arg=-Tlink_riscv64.x");
        }
    }
    ```

- **直接使用命令行（`RUSTFLAGS`环境变量）**：虽然`build.rs`提供了自动化构建过程中的灵活性和强大功能，你仍然可以直接使用命令行来构建项目。例如，你可以直接使用`cargo build --target your-target-triple`命令来指定目标架构。如果需要添加特定的编译标志，可以通过环境变量如`RUSTFLAGS`来设置，这对于简单项目或者一次性的构建任务来说可能更直接和方便。

  - 通过在命令行中设置`RUSTFLAGS`，你可以直接传递特定的编译器和链接器选项，这与`build.rs`脚本中使用`println!("cargo:rustc-link-arg=...")`达到的效果相同。

  - ```bash
    RUSTFLAGS="-C link-arg=-Tlink_riscv64.x" cargo build --target=riscv64gc-unknown-none-elf
    ```

- **`.cargo/config.toml`配置**：`.cargo/config.toml`配置提供了一种方法来配置Cargo的行为，包括默认的构建目标、环境变量、编译器参数等。在`.cargo`目录下创建`config.toml`文件，并在其中添加配置。这个文件可以控制Cargo的许多方面，对于简化命令行参数、设置默认目标架构和配置链接器等特别有用。

  - ```toml
    [build]
    target = "riscv64gc-unknown-none-elf"  # 默认构建目标
    
    [target.'cfg(target_arch = "riscv32")']
    rustflags = ["-C", "link-arg=-Tlink_riscv32.x"]  # 为riscv32目标设置特定的编译器标志
    
    [target.'cfg(target_arch = "riscv64")']
    rustflags = ["-C", "link-arg=-Tlink_riscv64.x"]  # 为riscv64目标设置特定的编译器标志
    ```

  - 这个配置文件做了以下几件事：

    - 设置默认构建目标为`riscv64gc-unknown-none-elf`。
    - 根据目标架构（`target_arch`）为`riscv32`和`riscv64`设置不同的编译器标志，这里主要是指定不同的链接脚本。

### 5⅓.**三种方法的辨析**

这三种方法都用于向Rust编译器传递特定的参数，尤其是用于指定链接脚本，从而影响编译的输出。它们的共同效果是确保编译过程中使用了特定的链接脚本，但各自的优点和使用场景有所不同。

- **共同效果**

无论是通过`build.rs`脚本、`RUSTFLAGS`环境变量，还是`.cargo/config.toml`配置文件，它们最终的作用都是向Rust编译器传递`-C link-arg=-T<linker_script>`参数。这告诉编译器（更准确地说是链接器），在将编译好的对象文件链接成最终的可执行文件或库文件时，使用指定的链接脚本。链接脚本控制了链接过程，如指定各个段（比如`.text`、`.data`、`.bss`等）的布局。

- **各自优点**

  - **`build.rs`**: 提供编程方式动态生成编译参数。特别是当编译参数需要基于复杂的逻辑决定时，`build.rs`更为灵活。例如，可以基于目标平台、环境变量或其他条件动态选择链接脚本。

  - **命令行 `RUSTFLAGS`**: 对于一次性编译任务或者在特定构建环境（如CI/CD流程）中非常有用，可以快速覆盖或添加编译参数，无需修改项目的配置文件。

  - **`.cargo/config.toml`**: 提供了一种持久化和项目范围内的配置方法，适用于那些需要针对特定目标平台持续使用相同编译设置的项目。

#### 设置的内容及其含义

##### `build.rs` 中的条件判断和动态参数设置

```rust
if target.contains("riscv32") {
    println!("cargo:rustc-link-arg=-Tlink_riscv32.x");
}
```

- 这段代码检查编译目标是否包含`"riscv32"`字符串。如果是，它会输出一个特殊的键值对，告诉Cargo向编译命令添加`-C link-arg=-Tlink_riscv32.x`参数，即使用`link_riscv32.x`作为链接脚本。

##### 命令行中的`RUSTFLAGS`

```bash
RUSTFLAGS="-C link-arg=-Tlink_riscv32.x" cargo build --target=riscv32imac-unknown-none-elf
```

- 通过环境变量`RUSTFLAGS`直接在命令行中指定编译器参数。这里`-C link-arg=-Tlink_riscv32.x`告诉链接器使用`link_riscv32.x`链接脚本，而`--target=riscv32imac-unknown-none-elf`指定了编译目标。

##### `.cargo/config.toml` 中的目标特定配置

- **针对特定架构的配置**

```toml
[target.'cfg(target_arch = "riscv32")']
rustflags = ["-C", "link-arg=-Tlink_riscv32.x"]
```

- 这个配置为满足`target_arch = "riscv32"`条件的目标设置了编译器标志。这意味着当编译目标的架构为`riscv32`时，会自动应用`-C link-arg=-Tlink_riscv32.x`编译器参数。

### 5⅔.三种方法的继续示例和其他辨析

为了实现指定编译目标为`riscv64gc-unknown-none-elf`，并且向编译器传递链接脚本`src/linker.ld`和启用强制帧指针的编译选项（`-Cforce-frame-pointers=yes`），我们可以通过以下不同的方法分别使用`build.rs`构建脚本、命令行构建，以及`.cargo/config.toml`来达到目的。

#### 使用 `build.rs` 构建脚本

在`build.rs`中，你可以检测目标架构，并基于此动态地添加编译器和链接器参数。但请注意，`build.rs`主要用于输出编译期间的配置，并不能直接指定编译目标，编译目标需要在命令行中通过`--target`标志或在`.cargo/config.toml`中配置。

```rust
use std::env;

fn main() {
    let target = env::var("TARGET").unwrap();
    if target == "riscv64gc-unknown-none-elf" {
        println!("cargo:rustc-link-arg=-Tsrc/linker.ld");
        println!("cargo:rustc-flags=-C force-frame-pointers=yes");
    }
}
```

#### 使用命令行构建

在命令行中，你可以直接通过环境变量`RUSTFLAGS`来添加编译器和链接器参数，并使用`--target`选项来指定目标架构。

```bash
RUSTFLAGS="-C link-arg=-Tsrc/linker.ld -C force-frame-pointers=yes" cargo build --target riscv64gc-unknown-none-elf
```

#### 使用 `.cargo/config.toml`

`.cargo/config.toml`提供了一种配置编译参数的持久化方法，这在你需要为特定目标架构重复使用相同的编译和链接设置时非常有用。

```toml
[build]
target = "riscv64gc-unknown-none-elf"

[target.riscv64gc-unknown-none-elf]
rustflags = [
    "-Clink-arg=-Tsrc/linker.ld", "-Cforce-frame-pointers=yes"
]
```

在这里，我们首先通过`[build]`部分设置了默认的编译目标为`riscv64gc-unknown-none-elf`，然后为这个特定的目标架构设置了需要的`rustflags`，包括指定链接脚本和启用强制帧指针的选项。

#### 再次总结

这三种方法各有利弊：

- **`build.rs`**提供了最大的灵活性，特别适合基于复杂逻辑动态生成编译配置。
- **命令行构建**适用于一次性构建或者在持续集成流程中动态调整编译参数。
- **`.cargo/config.toml`**是最稳定的配置方法，适合项目长期需要的固定编译配置。

选择哪种方法取决于项目需求、团队习惯和开发流程。

#### 其他辨析

- 在`.cargo/config.toml`中配置`rustflags`和通过命令行设置`RUSTFLAGS`时，存在着格式上的灵活性。这种灵活性允许开发者根据个人偏好或项目需求来选择最合适的表达方式。我们来详细探讨这些差异及其含义。

##### `.cargo/config.toml`中的`rustflags`

- **无空格格式**：

    ```toml
    rustflags = ["-Clink-arg=-Tsrc/linker.ld", "-Cforce-frame-pointers=yes"]
    ```

    在这种格式中，每个编译器选项作为数组的一个元素，`-C`和后续的指令（如`link-arg=`）紧密相连。这种格式减少了字符串的数量，使得整个数组看起来更加紧凑。

- **有空格格式**：

    ```toml
    rustflags = ["-C", "link-arg=-Tlink_riscv32.x"]
    ```

    这种格式将`-C`和其后的编译器指令分开成为数组的两个元素。这种方式可能在视觉上更清晰，特别是当编译器指令较长或者需要特别强调`-C`选项时。

  在功能上，这两种格式没有区别。它们都有效地向编译器传递了相同的指令。选择使用哪一种主要取决于个人或团队的偏好。

##### 命令行中的`RUSTFLAGS`

  在命令行中使用`RUSTFLAGS`环境变量时，你通常会将整个字符串作为一个连续的命令传递给编译器：

  ```bash
  RUSTFLAGS="-C link-arg=-Tlink_riscv32.x"
  ```

  这里，`-C`和`link-arg=`是作为同一个字符串的一部分。在命令行中，由于整个`RUSTFLAGS`值被引号包围，因此无论是否有空格，都会被视为同一个参数字符串的一部分。

##### `-C`后有没有空格的区别

- **在`.cargo/config.toml`中**，无论是`"-Clink-arg=..."`还是`"-C", "link-arg=..."`，实质上都是向`rustc`传递相同的参数。使用数组分割参数的主要区别在于可读性和个人偏好。
- **在命令行中**，由于整个`RUSTFLAGS`被视为一个字符串，`-C`后面是否有空格不影响参数的解析。但在实际书写时，为了保持一致性和可读性，可能需要根据团队规范来统一风格。

  总结来说，不管是在`.cargo/config.toml`配置文件中还是在命令行中设置编译参数，`-C`后面是否有空格主要影响的是可读性和格式上的偏好，并不会影响参数的功能。开发者可以根据个人或团队的编码风格来选择最合适的格式。

## 展开讲解的展开讲解

### 1. 使用了#![no_main]所以库项目还是二进制项目没什么区别了吧？

尽管使用了`#![no_main]`属性使得库项目和二进制项目在定义入口点方面的差异变得不那么明显，但在一些关键方面，二者仍有区别：

- **库项目**：更适合裸机编程，因为它允许完全自定义启动流程和入口点。库项目不期望有`main`函数，适合需要精细控制执行流程的场景。
- **二进制项目**：默认期待一个`main`函数作为程序的入口。虽然`#![no_main]`可以在二进制项目中使用，以允许自定义入口点，但通常在裸机或操作系统内核开发中偏好库项目，以获得更大的灵活性。

### 2. 使用链接脚本调整链接器行为

之前提到的`link_riscv32.x`  ,`link_riscv64.x` 和 `src/linker.ld` 都是链接脚本的示例。

> 链接脚本和它们在裸机编程中的作用是相对高级且特定的主题。这部分内容涉及内存布局、链接过程等复杂的概念，对初学者来说可能会感觉比较抽象和复杂。不过，请放心，对于刚开始接触基于RISC-V和Rust进行裸机编程的读者来说，完全理解链接脚本的细节并不是立刻必须的。

链接脚本（Linker Script）是由链接器使用的一种脚本文件，它指导链接器如何将各个编译后的对象（.o 文件）和库文件链接成最终的可执行文件或库文件。在裸机编程和操作系统开发中，正确的内存布局对于程序的运行至关重要。链接脚本允许开发者精确地指定各个段（如代码段`.text`、数据段`.data`、BSS段`.bss`）在内存中的位置和顺序。

#### 链接脚本在通用流程中的位置

在基于RISC-V和Rust进行裸机编程的通用流程中，**链接脚本的使用主要涉及到“编译代码”和“链接代码”这两个部分**。链接脚本直接影响了链接步骤，即将编译后的对象文件组合成最终的可执行文件的过程。

1. **编译代码**：在这一步，你的Rust代码会被编译成目标架构的机器代码（通常是一系列的对象文件）。此时，虽然代码已经被编译，但还没有被组织成一个可以执行的程序。
2. **链接代码**：在这一步，链接器根据链接脚本的指示，将上一步编译得到的对象文件和必要的库文件按照特定的布局链接成最终的可执行文件。链接脚本在这里起到了决定性的作用，因为它定义了程序内存布局的详细信息，比如哪部分代码或数据应该放在内存的哪个位置。

#### 链接脚本的内容

链接脚本包含了一系列的指令和符号定义，这些指令和定义告诉链接器如何将对象文件中的各个段（如`.text`、`.data`、`.bss`等）映射到目标内存中的位置。在裸机编程中，这允许开发者精确控制程序的布局，确保程序按照期望方式运行，特别是在有特定内存布局需求的嵌入式系统中。

例如，如果你的裸机程序需要在特定的内存地址运行，或者你需要将代码和数据放置在分离的内存区域（比如在有Harvard架构的系统中），就可以通过链接脚本来实现这些需求。

链接脚本的使用和配置通常在项目的构建配置阶段指定，如通过`build.rs`构建脚本动态添加链接器参数，或者在`.cargo/config.toml`中静态设置链接器参数。这样可以确保每次构建项目时，都会使用正确的链接脚本和相应的内存布局。

#### `.cargo/config.toml`配置使用链接脚本

通过在`.cargo/config.toml`文件中指定`rustflags`，可以告诉Rust编译器在编译过程中使用自定义的链接脚本。这里的`-Clink-arg=-Tsrc/linker.ld`就是指定链接脚本的参数。

```toml
[build]
target = "riscv64gc-unknown-none-elf"

[target.riscv64gc-unknown-none-elf]
rustflags = [
    "-Clink-arg=-Tsrc/linker.ld", "-Cforce-frame-pointers=yes"
]
```

这个配置指示编译器针对`riscv64gc-unknown-none-elf`目标，使用位于`src/linker.ld`的链接脚本，并强制启用帧指针（对于某些调试场景很有用）。

链接脚本的具体语法和能力非常丰富，涵盖了从符号定义到各种段布局的精细控制，这为操作系统开发和高级裸机编程提供了强大的支持。感兴趣的开发者可以进一步探索GNU链接器（ld）的文档来深入了解链接脚本的全部功能。

---

## Cargo.toml

**[rCore-Tutorial-Code-2024S ch1](https://github.com/LearningOS/rCore-Tutorial-Code-2024S/tree/ch1)/[os](https://github.com/LearningOS/rCore-Tutorial-Code-2024S/tree/ch1/os)/Cargo.toml**

在Rust项目中，`Cargo.toml`是一个用于配置项目属性、依赖关系、构建设置和其他元数据的文件。这个文件是Cargo（Rust的包管理器和构建工具）的核心部分，用于指导如何构建项目。下面将逐部分解析`Cargo.toml`文件中的内容，并补充相关的知识点。

### 文件内容解析

```toml
[package]
name = "os"
version = "0.1.0"
authors = ["Yifan Wu <shinbokuow@163.com>"]
edition = "2021"

[dependencies]
log = "0.4"

[profile.release]
debug = true
```

#### [package]

- `name`: 定义了包的名称，这里为`os`。这个名称是项目在Cargo及其依赖系统中的唯一标识。
- `version`: 指定了包的版本，遵循[语义化版本控制](https://semver.org/)（SemVer）规则。这里版本为`0.1.0`，表示这是一个初期开发阶段的版本。
- `authors`: 列出了包的作者及其联系方式。这有助于识别谁负责项目，并可能用于版权声明或联系。
- `edition`: 指定了Rust的版本，这里是`2021`版。Rust的版规定了编译器接受的代码特性和编译行为。选择更新的版通常提供更多的语言特性和改进。

#### [dependencies]

- `dependencies`节用于列出项目依赖的外部库。这里，项目依赖于`log`库的`0.4`版本，`log`是一个Rust社区广泛使用的日志记录接口。

#### [profile.release]

- `profile.release`配置了发布（release）构建的特定选项。
- `debug = true`: 即便在发布构建中，通常不包含调试信息以优化运行时性能，这里通过设置`debug = true`来保留调试信息。这可以帮助在发布版本中进行问题诊断，但可能会增加最终二进制文件的大小。

### 相关知识点补充

#### Cargo.toml的作用

`Cargo.toml`不仅用于定义基本的包信息和依赖，它还可以配置多个构建目标，包括库、二进制目标、测试和示例。这使得`Cargo.toml`成为管理和维护Rust项目结构的中心文件。

#### 依赖管理

Cargo处理依赖的方式提供了版本控制和兼容性保证。通过指定依赖的版本，Cargo可以确保构建的一致性，同时它的[版本兼容规则](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html)帮助管理依赖更新带来的风险。

#### 构建配置

Cargo支持多种[构建配置](https://doc.rust-lang.org/cargo/reference/profiles.html)，包括`dev`（默认的开发环境配置）和`release`（用于发布的配置，优化代码运行效率）。在`Cargo.toml`中配置这些属性可以精确控制编译过程，优化项目的开发和发布流程。

总之，`Cargo.toml`是Rust项目中不可或缺的一部分，通过精确配置可以极大地提升项目的可管理性和构建效率。

---

## Makefile

**[rCore-Tutorial-Code-2024S ch1](https://github.com/LearningOS/rCore-Tutorial-Code-2024S/tree/ch1)/[os](https://github.com/LearningOS/rCore-Tutorial-Code-2024S/tree/ch1/os)/Makefile**

在Rust项目中，`Makefile`常用于自动化复杂的构建流程，尤其是在涉及多步骤编译、链接和其他自定义构建操作时。这个`Makefile`特别适用于裸机编程项目，比如基于RISC-V的操作系统。以下是对`Makefile`前半部分的详细解析，以及相关知识点的深入讲解。

### Makefile 内容解析

#### 变量定义
```makefile
# Building
TARGET := riscv64gc-unknown-none-elf
MODE := release
KERNEL_ELF := target/$(TARGET)/$(MODE)/os
KERNEL_BIN := $(KERNEL_ELF).bin
DISASM_TMP := target/$(TARGET)/$(MODE)/asm
```

- `TARGET`: 指定了交叉编译目标，`riscv64gc-unknown-none-elf`表示这是一个针对RISC-V架构的裸机环境的目标。
- `MODE`: 编译模式，这里设置为`release`，意味着构建将进行优化以提高执行效率。
- `KERNEL_ELF`和`KERNEL_BIN`: 分别定义了内核的ELF格式文件和二进制文件的路径。
- `DISASM_TMP`: 用于存放汇编输出的临时文件路径。

```makefile
# Building mode argument
ifeq ($(MODE), release)
	MODE_ARG := --release
endif
```

- 这部分根据`MODE`变量的值来设置`MODE_ARG`。如果是`release`模式，则添加`--release`选项，这会影响Cargo的构建命令。

#### 开发板和引导加载器配置
```makefile
# BOARD
BOARD := qemu
SBI ?= rustsbi
BOOTLOADER := ../bootloader/$(SBI)-$(BOARD).bin
```

- `BOARD`和`SBI`: 分别设置开发板为QEMU模拟器和使用RustSBI作为SBI实现。`SBI`前的`?=`表示如果环境中未设置`SBI`变量，则默认使用`rustsbi`。
- `BOOTLOADER`: 定义了引导加载器文件的路径。

#### 内核入口地址和Binutils工具
```makefile
# KERNEL ENTRY
KERNEL_ENTRY_PA := 0x80200000

# Binutils
OBJDUMP := rust-objdump --arch-name=riscv64
OBJCOPY := rust-objcopy --binary-architecture=riscv64
```

- `KERNEL_ENTRY_PA`: 内核入口的物理地址。
- `OBJDUMP`和`OBJCOPY`: 使用Rust提供的二进制工具来处理目标文件。这些工具配置为支持RISC-V架构。

#### 构建规则
```makefile
# Disassembly
DISASM ?= -x

build: env $(KERNEL_BIN)

env:
	(rustup target list | grep "riscv64gc-unknown-none-elf (installed)") || rustup target add $(TARGET)
	cargo install cargo-binutils
	rustup component add rust-src
	rustup component add llvm-tools-preview

$(KERNEL_BIN): kernel
	@$(OBJCOPY) $(KERNEL_ELF) --strip-all -O binary $@
```

- `build`: 主构建目标，依赖于`env`和`$(KERNEL_BIN)`。确保环境设置完成并且内核二进制文件被创建。
- `env`: 检查是否安装了目标架构的支持，如果没有则安装。同时安装`cargo-binutils`，添加`rust-src`和`llvm-tools-preview`组件，这些是构建和分析过程中需要的工具。
- `$(KERNEL_BIN)`: 依赖于`kernel`目标，使用`objcopy`命令将ELF格式的内核文件转换为二进制格式，并移除所有符号信息以减小文件大小。

下面详细解释`Makefile`后半部分的各个部分和目标，这些规则为Rust基于RISC-V的裸机项目提供了构建、清理、反汇编、运行和调试的自动化支持。

### 各目标任务解析

#### kernel
```makefile
kernel:
	@echo Platform: $(BOARD)
	@cargo build $(MODE_ARG)
```
- `kernel`: 这个目标负责触发Cargo的构建流程。
- `@echo Platform: $(BOARD)`: 显示当前选定的开发板，这有助于在执行构建时确认正在使用的配置。
- `@cargo build $(MODE_ARG)`: 使用Cargo构建项目，`$(MODE_ARG)`根据是否为release模式传递`--release`标志，实现优化构建。

#### clean
```makefile
clean:
	@cargo clean
```
- `clean`: 清理由Cargo创建的所有构建文件和目标，使项目恢复到未构建状态，非常适合在重新构建前清除旧文件。

#### disasm 和 disasm-vim
```makefile
disasm: kernel
	@$(OBJDUMP) $(DISASM) $(KERNEL_ELF) | less

disasm-vim: kernel
	@$(OBJDUMP) $(DISASM) $(KERNEL_ELF) > $(DISASM_TMP)
	@vim $(DISASM_TMP)
	@rm $(DISASM_TMP)
```
- `disasm`: 生成内核的反汇编输出，并通过`less`进行查看。这对理解程序结构和调试非常有用。
- `disasm-vim`: 与`disasm`类似，但输出被重定向到临时文件，然后用`vim`打开该文件以便可以使用`vim`的编辑和查看功能。完成后，临时文件被删除。

#### run 和 run-inner
```makefile
run: run-inner

run-inner: build
	@qemu-system-riscv64 \
		-machine virt \
		-nographic \
		-bios $(BOOTLOADER) \
		-device loader,file=$(KERNEL_BIN),addr=$(KERNEL_ENTRY_PA)
```
- `run`和`run-inner`: 这两个目标负责在QEMU模拟器中启动构建的内核。
- `qemu-system-riscv64`: 使用QEMU的RISC-V系统模拟器启动内核。
- `-machine virt`: 指定虚拟机的类型。
- `-nographic`: 以无图形模式运行，适用于没有图形界面的环境。
- `-bios $(BOOTLOADER)`: 指定引导加载器文件。
- `-device loader,file=$(KERNEL_BIN),addr=$(KERNEL_ENTRY_PA)`: 将编译后的内核二进制文件加载到内存的指定地址处。

#### debug
```makefile
debug: build
	@tmux new-session -d \
		"qemu-system-riscv64 -machine virt -nographic -bios $(BOOTLOADER) -device loader,file=$(KERNEL_BIN),addr=$(KERNEL_ENTRY_PA) -s -S" && \
		tmux split-window -h "riscv64-unknown-elf-gdb -ex 'file $(KERNEL_ELF)' -ex 'set arch riscv:rv64' -ex 'target remote localhost:1234'" && \
		tmux -2 attach-session -d
```
- `debug`: 使用tmux和GDB来启动一个调试会话。
- `-s -S`: 让QEMU在启动时等待GDB连接，并打开一个GDB服务器。
- `riscv64-unknown-elf-gdb`: 启动GDB并连接到QEMU。

#### gdbserver 和 gdbclient
```makefile
gdbserver: build
	@qemu-system-riscv64 -machine virt -nographic -bios $(BOOTLOADER) -device loader,file=$(KERNEL_BIN),addr=$(KERNEL_ENTRY_PA) -s -S

gdbclient:
	@riscv64-unknown-elf-gdb -ex 'file $(KERNEL_ELF)' -ex 'set arch riscv:rv64' -ex 'target remote localhost:1234'
```
- `gdbserver`: 单独启动带有GDB服务器的QEMU实例。
- `

gdbclient`: 单独启动GDB并连接到已经运行的GDB服务器。

#### .PHONY
```makefile
.PHONY: build env kernel clean disasm disasm-vim run-inner gdbserver gdbclient
```
- `.PHONY`: 指明这些目标不是实际文件，确保即使存在同名文件，make也会执行相应的规则。

这个`Makefile`为复杂的构建和调试过程提供了自动化的管理，极大地简化了RISC-V裸机项目的开发流程。

### 相关知识点补充

使用`Makefile`的好处包括但不限于：
- **自动化复杂流程**：可以将编译、链接、转换格式等多个步骤集成在一个或多

个Make命令中，减少手动操作错误。
- **依赖管理**：Make可以自动处理文件依赖关系，仅重新构建改动的部分。
- **参数化构建**：通过变量和条件判断，可以轻松调整构建过程，适应不同的构建环境和需求。

`Makefile`在管理复杂项目中提供了强大的构建自动化支持，特别适用于涉及多语言和多工具链的嵌入式系统和裸机项目开发。

---

### 相关词汇表

- **标准库（std）**：Rust的标准库，提供了丰富的功能如数据结构、输入输出处理、线程等。在裸机或嵌入式编程中，通常不可用，因此会使用`#![no_std]`属性来禁用它。
- **库项目（lib）**：Rust的库项目，目的是创建可被其他项目引用的代码库，而非生成独立执行的程序。
- **二进制项目（bin）**：Rust的二进制项目，目的是生成可执行文件。这是最终用户直接运行的程序。
- **启动代码**：系统加电后首先执行的代码，用于初始化硬件和程序运行环境，为运行操作系统或应用程序准备。
- **构建脚本**：用于自动化编译和构建过程的脚本，如`Makefile`或Rust的`build.rs`文件。
- **构建环境**：编译和构建软件所需的软件和硬件环境，包括编译器、链接器、库等。
- **环境变量`RUSTFLAGS`**：设置Rust编译器选项的环境变量，用于影响编译过程，如优化级别、特性启用等。
- **`#![no_std]`**：Rust属性，用于在库或二进制项目中禁用标准库，允许编写裸机或嵌入式程序。
- **`#![no_main]`**：Rust属性，允许禁用默认的入口点，通常用于自定义启动代码的场景。
- **`#[no_mangle]`**：Rust属性，禁用编译器对特定函数名的修饰（mangling），保证函数名在编译后不变，常用于外部代码（如C或汇编）调用Rust函数。
- **`#[panic_handler]`**：Rust属性，用于定义panic时的处理函数，是`#![no_std]`环境下必需的。
- **`core`库**：Rust的核心库，是标准库的子集，不依赖操作系统，可以在`#![no_std]`环境中使用。
- **自定义库**：用户或团队自行开发的库，用于特定功能或业务逻辑，可以被其他项目引用。
- **编译标志/编译器参数**：编译过程中传递给编译器的选项，用于控制编译行为和输出。
- **`Cargo.toml`配置文件**：Rust项目的配置文件，定义了项目的依赖、版本、编译选项等信息。
- **链接脚本**：指导链接器如何将各个编译后的对象文件组合成最终可执行文件的脚本。它定义了内存布局和各个段的安排。
- **链接器**：将编译后的对象文件和库链接成可执行文件的工具。
- **编译后的对象（.o 文件）**：源代码编译后的中间产物，包含机器码但尚未链接成最终的可执行文件。
- **内存布局**：程序在内存中的组织方式，包括各个段的位置和大小。
- **代码段`.text`**：存放程序指令的内存区域。
- **数据段`.data`**：存放已初始化的全局变量和静态变量的内存区域。
- **BSS段`.bss`**：用于存放未初始化的全局变量和静态变量，在程序启动时通常被清零。
